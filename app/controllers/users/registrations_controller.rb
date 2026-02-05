# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

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
