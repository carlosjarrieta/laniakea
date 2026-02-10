class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    # Redirigimos al nuevo controlador directo de Facebook
    redirect_to api_v1_facebook_auth_url(token: params[:token])
  end

  def failure
    frontend_url = ENV.fetch('FRONTEND_URL', 'http://localhost:3001')
    redirect_to "#{frontend_url}/login?error=auth_failed", allow_other_host: true
  end
end
