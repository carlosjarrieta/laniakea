class StripeService
  def self.create_checkout_session(account, plan_id, success_url, cancel_url)
    plan = Plan.find(plan_id)
    
    # Initialize Stripe
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']

    session = Stripe::Checkout::Session.create({
      customer: account.stripe_customer_id,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.stripe_price_id,
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
    rescue JSON::ParserError => e
      return { status: 400, error: 'Invalid payload' }
    rescue Stripe::SignatureVerificationError => e
      return { status: 400, error: 'Invalid signature' }
    end

    case event.type
    when 'checkout.session.completed'
      session = event.data.object
      handle_checkout_completed(session)
    when 'customer.subscription.deleted', 'customer.subscription.updated'
      subscription = event.data.object
      handle_subscription_updated(subscription)
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
end
