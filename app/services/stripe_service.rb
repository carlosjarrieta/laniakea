class StripeService
  def self.create_checkout_session(account, plan_id, interval = 'monthly', success_url, cancel_url)
    plan = Plan.find(plan_id)
    
    price_id = interval == 'yearly' ? plan.stripe_yearly_price_id : plan.stripe_price_id

    Stripe.api_key = ENV['STRIPE_SECRET_KEY']

    # Ensure account has a stripe_customer_id
    if account.stripe_customer_id.blank?
      customer_params = {
        name: account.name,
        email: account.billing_email || account.owner&.email,
        metadata: { 
          account_id: account.id,
          tax_id: account.tax_id 
        }
      }

      if account.address.present?
        customer_params[:address] = {
          line1: account.address,
          city: account.city,
          postal_code: account.postal_code,
          country: account.country_code
        }
      end

      customer = Stripe::Customer.create(customer_params)
      account.update!(stripe_customer_id: customer.id)
    end

    session = Stripe::Checkout::Session.create({
      customer: account.stripe_customer_id,
      payment_method_types: ['card'],
      line_items: [{
        price: price_id,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: success_url,
      cancel_url: cancel_url,
      metadata: {
        account_id: account.id,
        plan_id: plan.id
      }
    })

    session
  end

  def self.handle_webhook(payload, sig_header)
    endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET']
    event = nil

    begin
      event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
    rescue JSON::ParserError
      return { status: 400, error: 'Invalid payload' }
    rescue Stripe::SignatureVerificationError
      Rails.logger.error "⚠️ Stripe Webhook Error: Invalid signature"
      return { status: 400, error: 'Invalid signature' }
    end

    Rails.logger.info "🔔 Stripe Webhook Received: #{event.type}"

    case event.type
    when 'checkout.session.completed'
      session = event.data.object
      handle_checkout_completed(session)
    when 'customer.subscription.deleted', 'customer.subscription.updated'
      subscription = event.data.object
      handle_subscription_updated(subscription)
    when 'invoice.payment_succeeded'
      invoice = event.data.object
      handle_payment_succeeded(invoice)
    end

    { status: 200 }
  end

  private

  def self.handle_checkout_completed(session)
    account = Account.find(session.metadata.account_id)
    account.update!(
      stripe_subscription_id: session.subscription,
      plan_id: session.metadata.plan_id,
      status: :active
    )
  end

  def self.handle_subscription_updated(subscription)
    account = Account.find_by(stripe_subscription_id: subscription.id)
    return unless account

    status = case subscription.status
             when 'active' then :active
             when 'trialing' then :trialing
             when 'past_due' then :past_due
             when 'canceled', 'unpaid' then :canceled
             else account.status
             end

    account.update!(status: status)
  end

  def self.handle_payment_succeeded(invoice)
    Rails.logger.info "💰 Processing payment_succeeded for Customer: #{invoice.customer}, Invoice: #{invoice.id}"
    
    account = Account.find_by(stripe_customer_id: invoice.customer)
    
    
    # Fallback for local testing: Try to find by email if customer ID doesn't match
    if !account && Rails.env.development?
      customer_email = invoice.customer_email
      
      # If invoice doesn't have email, try fetching the customer object
      if customer_email.blank? && invoice.customer
        begin
          customer = Stripe::Customer.retrieve(invoice.customer)
          customer_email = customer.email
          Rails.logger.info "🔍 Fetched customer from Stripe: #{customer_email}"
        rescue => e
          Rails.logger.error "⚠️ Error fetching customer from Stripe: #{e.message}"
        end
      end

      if customer_email.present?
        Rails.logger.warn "⚠️ Account not found by ID. Trying email fallback: #{customer_email}"
        account = Account.find_by(billing_email: customer_email) || 
                  User.find_by(email: customer_email)&.account
        
        if account
          Rails.logger.info "✅ Account found via email fallback: #{account.name}"
          # Optional: Update the ID to match future requests
          account.update(stripe_customer_id: invoice.customer)
        end
      end
    end
    
    unless account
      Rails.logger.error "❌ Account not found for Stripe Customer ID: #{invoice.customer}"
      return
    end

    Rails.logger.info "✅ Account found: #{account.name} (ID: #{account.id})"

    # Create Payment Record
    payment = Payment.create!(
      account: account,
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_invoice_id: invoice.id,
      amount_cents: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      payment_date: Time.at(invoice.created),
      metadata: { 
        hosted_invoice_url: invoice.hosted_invoice_url,
        pdf: invoice.invoice_pdf 
      }
    )

    Rails.logger.info "✅ Payment record created: ##{payment.id} for $#{payment.amount_cents / 100.0}"

    # Ensure account is active if payment succeeded
    if account.status != 'active'
      account.update!(status: :active)
      Rails.logger.info "✅ Account #{account.id} activated due to successful payment."
    end
  end
end
