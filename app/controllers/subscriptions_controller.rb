class SubscriptionsController < ApplicationController
  before_action :authenticate_user!

  def checkout
    authorize! :manage, :billing
    plan = Plan.find(params[:plan_id])
    interval = params[:interval] || 'monthly'

    account = current_user.account

    session = StripeService.create_checkout_session(
      account,
      plan.id,
      interval,
      success_url,
      cancel_url
    )

    render json: { url: session.url }
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def portal
    authorize! :manage, :billing
    account = current_user.account
    
    # Ensure Stripe is initialized
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']

    # Create a portal session
    session = Stripe::BillingPortal::Session.create({
      customer: account.stripe_customer_id,
      return_url: "#{ENV.fetch('FRONTEND_URL')}/settings/billing",
    })

    render json: { url: session.url }
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def success_url
    "#{ENV.fetch('FRONTEND_URL')}/settings/billing?success=true"
  end

  def cancel_url
    "#{ENV.fetch('FRONTEND_URL')}/settings/billing?canceled=true"
  end
end
