# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: I18n.t('users.sessions.logged_in') },
      data: resource
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: I18n.t('users.sessions.logged_out')
      }, status: :ok
    else
      render json: {
        status: 401,
        message: I18n.t('users.sessions.session_not_found')
      }, status: :unauthorized
    end
  end
end
