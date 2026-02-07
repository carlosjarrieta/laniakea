class Users::ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      render json: { 
        status: { 
          code: 200, 
          message: I18n.t('devise.confirmations.confirmed'),
          data: resource
        }
      }, status: :ok
    else
      render json: {
        status: {
          code: 422,
          message: resource.errors.full_messages.to_sentence,
          errors: resource.errors.full_messages
        }
      }, status: :unprocessable_entity
    end
  end
end
