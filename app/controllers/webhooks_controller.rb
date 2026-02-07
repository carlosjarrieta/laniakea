class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def stripe
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']

    result = StripeService.handle_webhook(payload, sig_header)
    
    if result[:status] == 200
      head :ok
    else
      render json: { error: result[:error] }, status: result[:status]
    end
  end
end
