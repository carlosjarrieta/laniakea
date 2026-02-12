class Api::V1::AdCampaignsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account
  before_action :set_campaign

  # POST /api/v1/campaigns/:campaign_id/ad_campaigns
  def create
    @ad_campaign = @campaign.ad_campaign || @campaign.build_ad_campaign
    @ad_campaign.assign_attributes(ad_campaign_params)
    @ad_campaign.status ||= 'draft'

    if @ad_campaign.save
      render json: @ad_campaign, status: :created
    else
      render json: { errors: @ad_campaign.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/v1/campaigns/:campaign_id/ad_campaigns/publish
  def publish
    @ad_campaign = @campaign.ad_campaign
    return render json: { error: "No ad campaign configured" }, status: :not_found unless @ad_campaign

    ad_account_id = params[:ad_account_id]
    page_id = params[:page_id]
    
    if ad_account_id.blank? || page_id.blank?
      return render json: { error: "Ad Account and Page ID are required" }, status: :bad_request
    end

    # Get the first post to use as creative (or let user choose)
    post = @campaign.campaign_posts.first
    return render json: { error: "No posts found to create ad" }, status: :unprocessable_entity unless post

    service = Facebook::AdsService.new(current_user, ad_account_id)
    
    result = service.orchestrate_ad_campaign(
      @ad_campaign,
      page_id: page_id,
      post_content: post.content,
      image_url: post.real_image_url || post.image_url
    )

    render json: { message: "Ads launched successfully", facebook_ad_id: result['id'] }
  rescue Koala::Facebook::ClientError => e
    error_msg = e.message.downcase
    if error_msg.include?("budget") || error_msg.include?("presupuesto")
      # Extract the specific budget message if possible
      human_msg = e.fb_error_user_msg || e.message
      render json: { 
        error: "Presupuesto insuficiente", 
        detail: human_msg,
        type: "budget_warning" 
      }, status: :unprocessable_entity
    else
      render json: { error: e.message, type: "facebook_error" }, status: :internal_server_error
    end
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

  def set_account
    @account = current_user.account
  end

  def set_campaign
    @campaign = @account.campaigns.find(params[:campaign_id])
  end

  def ad_campaign_params
    params.require(:ad_campaign).permit(:budget, :status, metadata: {})
  end
end
