class Api::V1::CampaignsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account
  before_action :set_campaign, only: [:show, :update, :destroy]

  def index
    @pagy, @campaigns = pagy(@account.campaigns.includes(campaign_posts: :image_attachment).order(created_at: :desc), limit: params[:items] || 12)
    render json: {
      campaigns: @campaigns.as_json(include: { campaign_posts: { methods: :real_image_url } }),
      pagination: {
        page: @pagy.page,
        items: @pagy.limit,
        count: @pagy.count,
        pages: @pagy.pages,
        next: @pagy.next,
        prev: @pagy.prev
      }
    }
  end

  def show
    render json: @campaign.as_json(include: { campaign_posts: { methods: :real_image_url } })
  end

  def create
    @campaign = @account.campaigns.new(campaign_params)
    if @campaign.save
      render json: @campaign, status: :created
    else
      render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @campaign.update(campaign_params)
      render json: @campaign
    else
      render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @campaign.destroy
    head :no_content
  end

  private

  def set_account
    @account = current_user.account
  end

  def set_campaign
    @campaign = @account.campaigns.find(params[:id])
  end

  def campaign_params
    params.require(:campaign).permit(:name, :description, :status, :metadata)
  end
end
