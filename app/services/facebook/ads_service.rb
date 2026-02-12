module Facebook
  class AdsService
    attr_reader :api, :ad_account_id

    def initialize(user, ad_account_id = nil)
      @user = user
      account = user.connected_accounts.find_by(provider: 'facebook')
      raise "Facebook account not connected" unless account

      @token = account.access_token
      @api = Koala::Facebook::API.new(@token)
      @ad_account_id = ad_account_id # Format: act_123456789
    end

    def list_ad_accounts
      @api.get_connections("me", "adaccounts", fields: "name,id,currency,account_status,amount_spent")
    end

    # Orchestrate the whole flow: Campaign -> AdSet -> Creative -> Ad
    def orchestrate_ad_campaign(laniakea_ad_campaign, page_id:, post_content:, image_url: nil)
      # 1. Create Campaign
      fb_campaign = create_campaign(
        name: "Laniakea: #{laniakea_ad_campaign.campaign.name}",
        objective: 'OUTCOME_ENGAGEMENT' # Defaulting to engagement for now
      )
      campaign_id = fb_campaign['id']

      # 2. Prepare Targeting from metadata
      targeting = prepare_targeting(laniakea_ad_campaign.metadata['segmentation'])

      # 3. Create AdSet
      fb_ad_set = create_ad_set(
        campaign_id: campaign_id,
        name: "Set: #{laniakea_ad_campaign.campaign.name}",
        targeting: targeting,
        billable_event: 'IMPRESSIONS',
        optimization_goal: 'REACH',
        daily_budget: (laniakea_ad_campaign.budget.to_f * 100).to_i, # Conver to cents
        start_time: Time.current.iso8601,
        status: 'PAUSED'
      )
      ad_set_id = fb_ad_set['id']

      # 4. Create Creative
      # Using a link-based post pointing to a placeholder or the page
      object_story_spec = {
        page_id: page_id,
        link_data: {
          message: post_content,
          link: "https://facebook.com/#{page_id}", # Or a specific landing page
          picture: image_url
        }
      }
      
      fb_creative = create_ad_creative(
        name: "Creative: #{laniakea_ad_campaign.campaign.name}",
        object_story_spec: object_story_spec.to_json
      )
      creative_id = fb_creative['id']

      # 5. Create Ad
      fb_ad = create_ad(
        name: "Ad: #{laniakea_ad_campaign.campaign.name}",
        ad_set_id: ad_set_id,
        creative_id: creative_id
      )

      # Update our local record
      laniakea_ad_campaign.update!(
        facebook_campaign_id: campaign_id,
        facebook_ad_set_id: ad_set_id,
        facebook_ad_id: fb_ad['id'],
        status: 'active'
      )

      fb_ad
    end

    def create_campaign(name:, objective:, status: 'PAUSED', special_ad_categories: [])
      payload = {
        name: name,
        objective: objective,
        status: status,
        special_ad_categories: special_ad_categories.any? ? special_ad_categories : 'NONE',
        # Explicitly disable CBO so we can set budget on AdSet level without 'budget sharing' errors
        buying_type: 'AUCTION',
        is_adset_budget_sharing_enabled: false
      }
      
      @api.put_connections(@ad_account_id, "campaigns", payload)
    end

    def create_ad_set(campaign_id:, name:, targeting:, billable_event:, optimization_goal:, daily_budget:, start_time:, status: 'PAUSED')
      payload = {
        name: name,
        campaign_id: campaign_id,
        targeting: targeting,
        optimization_goal: optimization_goal,
        daily_budget: daily_budget,
        start_time: start_time,
        status: status,
        billing_event: billable_event,
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP'
      }
      @api.put_connections(@ad_account_id, "adsets", payload)
    end

    def create_ad_creative(name:, object_story_spec:)
      @api.put_connections(@ad_account_id, "adcreatives", { name: name, object_story_spec: object_story_spec })
    end

    def create_ad(name:, ad_set_id:, creative_id:, status: 'PAUSED')
      payload = {
        name: name,
        adset_id: ad_set_id,
        creative: { creative_id: creative_id },
        status: status
      }
      @api.put_connections(@ad_account_id, "ads", payload)
    end

    private

    def prepare_targeting(seg)
      # Translate our AI metadata to FB params
      # Needs ISO Country codes and Interest IDs usually, but FB Search API can find them.
      # Simplified for now:
      {
        geo_locations: { countries: ['US', 'MX', 'CO'] }, # Defaulting for demo
        age_min: seg['age_range']&.first || 18,
        age_max: seg['age_range']&.last || 65,
        publisher_platforms: ['facebook', 'instagram']
      }
    end
  end
end
