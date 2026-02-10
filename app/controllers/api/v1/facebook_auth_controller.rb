# app/controllers/api/v1/facebook_auth_controller.rb
# Controlador para la autenticación directa con Facebook (sin OmniAuth)
# Usa HTTParty para comunicarse directamente con Facebook Graph API
module Api
  module V1
    class FacebookAuthController < ApplicationController
      before_action :authenticate_user!, except: [:auth_url, :callback]

      # GET /api/v1/facebook/auth_url?token=JWT_TOKEN
      # El frontend navega directamente aquí (no AJAX).
      # Esto garantiza que la cookie de sesión se establece en localhost:3000
      # y persiste para el callback.
      def auth_url
        # Decodificar el JWT que viene como parámetro
        token = params[:token].to_s.sub(/^Bearer\s+/i, '') # Quitar "Bearer " si existe
        unless token.present?
          redirect_to "#{frontend_url}/integrations?error=missing_token", allow_other_host: true
          return
        end

        begin
          secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.credentials.fetch(:secret_key_base)
          payload = JWT.decode(token, secret, true, algorithm: 'HS256').first
          user = User.find(payload['sub'])
        rescue => e
          Rails.logger.error "FACEBOOK AUTH ERROR: Token inválido: #{e.message}"
          redirect_to "#{frontend_url}/integrations?error=invalid_token", allow_other_host: true
          return
        end

        callback_url = "#{request.base_url}/api/v1/facebook/callback"
        state = SecureRandom.hex(32)
        
        # Guardamos el user_id en la sesión de Rails
        session[:facebook_oauth_state] = state
        session[:facebook_linking_user_id] = user.id
        
        # Scopes completos ahora que están habilitados en el portal de developers
        # Removemos 'email' ya que parece estar bloqueado en el App Type actual
        permissions = [
          'public_profile',
          'pages_show_list',
          'pages_manage_posts',
          'pages_read_engagement'
        ].join(',')
        
        fb_url = "https://www.facebook.com/v19.0/dialog/oauth?" + {
          client_id: ENV['FACEBOOK_APP_ID'],
          redirect_uri: callback_url,
          scope: permissions,
          state: state,
          response_type: 'code'
        }.to_query
        
        redirect_to fb_url, allow_other_host: true
      end

      # GET /api/v1/facebook/callback
      # Callback después de la autorización de Facebook
      # NOTA: Esta ruta NO tiene JWT (viene de Facebook, no del frontend)
      # Por eso recuperamos el user_id de la sesión
      def callback
        # Recuperar el usuario de la sesión
        user_id = session.delete(:facebook_linking_user_id)
        user = User.find_by(id: user_id)
        
        unless user
          Rails.logger.error "FACEBOOK AUTH ERROR: No user found in session"
          redirect_to "#{frontend_url}/integrations?error=session_expired", allow_other_host: true
          return
        end
        # Verificar si hubo error en la autorización
        if params[:error]
          redirect_to "#{frontend_url}/integrations?error=#{params[:error]}"
          return
        end

        code = params[:code]
        
        begin
          # Intercambiar código por token de acceso
          token_data = exchange_code_for_token(code)
          access_token = token_data['access_token']
          
          # Obtener token de larga duración (60 días)
          long_lived = get_long_lived_token(access_token)
          
          # Obtener información del usuario de Facebook
          user_info = get_facebook_user_info(long_lived['access_token'])
          
          # Guardar en ConnectedAccount (reutilizamos tu modelo existente)
          account = user.connected_accounts.find_or_initialize_by(
            provider: 'facebook',
            uid: user_info['id']
          )
          
          account.update!(
            name: user_info['name'],
            access_token: long_lived['access_token'],
            expires_at: Time.now + (long_lived['expires_in'] || 5184000).to_i.seconds,
            metadata: user_info.to_json
          )
          
          redirect_to "#{frontend_url}/integrations?status=success&provider=facebook", allow_other_host: true
        rescue StandardError => e
          Rails.logger.error "FACEBOOK AUTH ERROR: #{e.message}"
          redirect_to "#{frontend_url}/integrations?error=authentication_failed", allow_other_host: true
        end
      end

      private

      def frontend_url
        ENV.fetch('FRONTEND_URL', 'http://localhost:3001')
      end

      def exchange_code_for_token(code)
        callback_url = "#{request.base_url}/api/v1/facebook/callback"
        
        response = HTTParty.get('https://graph.facebook.com/v19.0/oauth/access_token', {
          query: {
            client_id: ENV['FACEBOOK_APP_ID'],
            client_secret: ENV['FACEBOOK_APP_SECRET'],
            redirect_uri: callback_url,
            code: code
          }
        })
        
        raise "Error al intercambiar código: #{response.body}" unless response.success?
        JSON.parse(response.body)
      end

      def get_long_lived_token(short_token)
        response = HTTParty.get('https://graph.facebook.com/v19.0/oauth/access_token', {
          query: {
            grant_type: 'fb_exchange_token',
            client_id: ENV['FACEBOOK_APP_ID'],
            client_secret: ENV['FACEBOOK_APP_SECRET'],
            fb_exchange_token: short_token
          }
        })
        
        raise "Error al obtener token de larga duración: #{response.body}" unless response.success?
        JSON.parse(response.body)
      end

      def get_facebook_user_info(access_token)
        response = HTTParty.get('https://graph.facebook.com/v19.0/me', {
          query: {
            fields: 'id,name,picture',
            access_token: access_token
          }
        })
        
        raise "Error al obtener info del usuario: #{response.body}" unless response.success?
        JSON.parse(response.body)
      end
    end
  end
end
