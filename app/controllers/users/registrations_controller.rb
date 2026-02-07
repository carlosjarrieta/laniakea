class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  def create
    build_resource(sign_up_params)

    invitation = Invitation.find_by(token: params[:invitation_token]) if params[:invitation_token].present?

    resource.save
    if resource.persisted?
      if invitation
        Membership.create!(
          user: resource,
          account: invitation.account,
          role: invitation.role,
          status: :active
        )
        invitation.update!(accepted_at: Time.current)
      end
      
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
      else
        expire_data_after_sign_in!
      end
      respond_with resource, location: after_sign_up_path_for(resource)
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
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

  private

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :invitation_token])
  end

  def configure_account_update_params
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end
