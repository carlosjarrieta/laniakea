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

  # DELETE /api/v1/integrations/:id
  def destroy
    account = current_user.connected_accounts.find(params[:id])
    account.destroy!
    
    render json: { message: 'Integration disconnected successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Integration not found' }, status: :not_found
  end
end
