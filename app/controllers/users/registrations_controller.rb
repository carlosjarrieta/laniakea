class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  private

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end

  def respond_with(resource, _opts = {})
    if request.method == 'POST' && resource.persisted?
      render json: {
        status: { code: 200, message: I18n.t('users.registrations.signed_up') },
        data: resource
      }, status: :ok
    elsif request.method == 'DELETE'
      render json: {
        status: { code: 200, message: I18n.t('users.registrations.account_deleted') }
      }, status: :ok
    else
      render json: {
        status: { code: 422, message: "#{I18n.t('users.registrations.signup_failed')} #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end
