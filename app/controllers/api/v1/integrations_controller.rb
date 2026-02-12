class Api::V1::IntegrationsController < ApplicationController
  before_action :authenticate_user!

  # GET /api/v1/integrations
  def index
    connected_accounts = current_user.connected_accounts
    
    render json: {
      integrations: connected_accounts.map do |account|
        {
          id: account.id,
          provider: account.provider,
          name: account.name,
          image: account.image,
          connected_at: account.created_at
        }
      end
    }
  end

  # GET /api/v1/integrations/facebook_pages
  def facebook_pages
    account = current_user.connected_accounts.find_by(provider: 'facebook')
    return render json: { error: 'Facebook not connected' }, status: :not_found unless account

    # Usamos la gema Koala para hablar con Facebook
    @graph = Koala::Facebook::API.new(account.access_token)
    # Pedimos explícitamente el campo 'picture' para mostrarlo en el frontend
    pages = @graph.get_connections("me", "accounts", fields: 'name,access_token,picture,id,tasks')
    
    render json: { pages: pages }
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  # GET /api/v1/integrations/facebook_ad_accounts
  def facebook_ad_accounts
    account = current_user.connected_accounts.find_by(provider: 'facebook')
    return render json: { error: 'Facebook not connected' }, status: :not_found unless account

    # Usamos Facebook Marketing API
    @graph = Koala::Facebook::API.new(account.access_token)
    
    begin
      # Intentamos el endpoint estándar
      ad_accounts = @graph.get_connections("me", "adaccounts", fields: 'name,account_id,id,currency,account_status').to_a
      
      # Si está vacío, probamos una alternativa común en algunas versiones de la API
      if ad_accounts.empty?
        ad_accounts = @graph.get_connections("me", "ad_accounts", fields: 'name,account_id,id,currency,account_status').to_a
      end

      # Log de depuración
      Rails.logger.info "[Facebook] Ad Accounts found: #{ad_accounts.count}"
      
      # Si sigue vacío, probamos obtenerlo vía el objeto 'me' directamente
      if ad_accounts.empty?
        me = @graph.get_object("me", fields: 'adaccounts{name,account_id,id,currency,account_status}')
        ad_accounts = me.dig('adaccounts', 'data') || []
        Rails.logger.info "[Facebook] Ad Accounts via 'me' object: #{ad_accounts.count}"
      end
      
      # Si sigue vacío y tenemos permiso de business_management, probamos vía Business Manager
      if ad_accounts.empty?
        Rails.logger.info "[Facebook] Trying via Business Manager..."
        businesses = @graph.get_connections("me", "businesses")
        businesses.each do |business|
          begin
            # Fetch accounts for this business
            ba = @graph.get_connections(business['id'], "client_ad_accounts", fields: 'name,account_id,id,currency,account_status').to_a
            if ba.empty?
               ba = @graph.get_connections(business['id'], "owned_ad_accounts", fields: 'name,account_id,id,currency,account_status').to_a
            end
            Rails.logger.info "[Facebook] Found #{ba.count} accounts in Business #{business['name']}"
            ad_accounts.concat(ba)
          rescue => e
            Rails.logger.warn "[Facebook] Failed to fetch accounts for business #{business['name']}: #{e.message}"
          end
        end
      end
      
      render json: { ad_accounts: ad_accounts }
    rescue Koala::Facebook::APIError => e
      Rails.logger.error "[Facebook] API Error: #{e.message}"
      
      # Check current permissions
      begin
        permissions = @graph.get_connections("me", "permissions")
        Rails.logger.error "[Facebook] Current Permissions: #{permissions.inspect}"
      rescue => perm_error
        Rails.logger.error "[Facebook] Could not fetch permissions: #{perm_error.message}"
      end

      render json: { error: "Facebook API Error: #{e.message}", code: e.fb_error_code }, status: :internal_server_error
    end
  rescue => e
    Rails.logger.error "[Facebook] Unexpected Error: #{e.message}"
    render json: { error: e.message }, status: :internal_server_error
  end

  # DELETE /api/v1/integrations/:id
  def destroy
    account = current_user.connected_accounts.find(params[:id])
    account.destroy!
    
    render json: { message: 'Integration disconnected successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Integration not found' }, status: :not_found
  end
end
