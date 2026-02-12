class Api::V1::CampaignPostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account
  before_action :set_campaign, only: [:index, :create]
  before_action :set_post, only: [:update, :destroy, :publish, :refresh_metrics]

  def index
    @posts = @campaign.campaign_posts.order(created_at: :desc)
    render json: @posts
  end

  def publish
    case @post.platform
    when 'facebook'
      page_id = params[:page_id]
      page_access_token = params[:page_access_token]

      if page_id.present? && page_access_token.present?
        if @post.publish_to_facebook!(page_id, page_access_token)
          render json: { message: 'Publicado exitosamente', post: @post }
        else
          render json: { error: 'Fallo al publicar' }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Faltan parámetros de la página' }, status: :bad_request
      end
    else
      render json: { error: "Plataforma #{@post.platform} no soportada aún para publicación directa" }, status: :bad_request
    end
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  def refresh_metrics
    # Trigger inline for immediate feedback, or background for scalability. 
    # For user click, inline might be better for now or return accepted.
    # Let's do inline for MVP to see results immediately.
    metrics = Facebook::MetricsFetcher.new(@post).call
    
    if metrics
      render json: { message: 'Métricas actualizadas', metrics: metrics }
    else
      render json: { error: 'No se pudieron actualizar las métricas' }, status: :unprocessable_entity
    end
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  def create
    @post = @campaign.campaign_posts.new(post_params)
    if @post.save
      render json: @post, status: :created
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    head :no_content
  end

  private

  def set_account
    @account = current_user.account
  end

  def set_campaign
    @campaign = @account.campaigns.find(params[:campaign_id])
  end

  def set_post
    @post = CampaignPost.joins(campaign: :account).where(campaigns: { account_id: @account.id }).find(params[:id])
  end

  def post_params
    params.require(:campaign_post).permit(:platform, :content, :image_prompt, :image_url, :status, :image, metadata: [:facebook_post_id, :published_at, :last_error, :page_id, :page_access_token, hashtags: []])
  end
end
