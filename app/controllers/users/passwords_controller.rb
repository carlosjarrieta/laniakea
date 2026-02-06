class Users::PasswordsController < Devise::PasswordsController
  respond_to :json

  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
      render json: {
        message: I18n.t('devise.passwords.send_instructions')
      }, status: :ok
    else
      render json: {
        message: resource.errors.full_messages.to_sentence
      }, status: :unprocessable_entity
    end
  end

  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      if Devise.sign_in_after_reset_password
        render json: {
          message: I18n.t('devise.passwords.updated')
        }, status: :ok
      else
        render json: {
          message: I18n.t('devise.passwords.updated_not_active')
        }, status: :ok
      end
    else
      render json: {
        message: resource.errors.full_messages.to_sentence
      }, status: :unprocessable_entity
    end
  end
end
