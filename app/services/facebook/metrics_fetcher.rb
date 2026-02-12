module Facebook
  class MetricsFetcher
    def initialize(campaign_post)
      @post = campaign_post
    end

    def call
      return unless @post.facebook? && @post.published?
      return unless @post.metadata['facebook_post_id'].present?
      
      # We need a page access token. Ideally stored in metadata when publishing,
      # or retrieved from the connected account if we knew which page it belongs to.
      # For now, we rely on it being in metadata as per plan.
      access_token = @post.metadata['page_access_token']
      
      # Fallback: Try to find a connected facebook account and use its token, 
      # though this might be a user token, not page token, which might not work for insights 
      # depending on permissions. But it's a safety net.
      if access_token.blank?
        # Try to find a connected facebook account for the owner of the campaign
        user = @post.campaign.account.users.first # Simplificado
        fb_account = user&.connected_accounts&.find_by(provider: 'facebook')
        
        if fb_account
          # Note: Insights usually need a Page Token. A User Token might fail 
          # but it's better than nothing for public posts if permissions allow.
          access_token = fb_account.access_token
          Rails.logger.info "MetricsFetcher: Using fallback user token for post #{@post.id}"
        else
          Rails.logger.error "MetricsFetcher: No access token found for post #{@post.id}"
          return
        end
      end

      graph = Koala::Facebook::API.new(access_token)
      
      # Fetch insights
      # Metrics: https://developers.facebook.com/docs/graph-api/reference/v19.0/insights
      # We want: post_impressions, post_clicks, post_reactions_by_type_total
      
      # Some insights work better with PAGEID_POSTID format
      page_id = @post.metadata['page_id']
      fb_post_id = @post.metadata['facebook_post_id']
      full_post_id = (page_id.present? && !fb_post_id.include?('_')) ? "#{page_id}_#{fb_post_id}" : fb_post_id

      begin
        # We try to get Insights. We removed the basic 'reactions' field because it fails on 'Photo' nodes.
        # We add 'reach' as a fallback if insights are empty.
        response = graph.get_object(
          full_post_id, 
          fields: 'insights.metric(post_impressions,post_impressions_unique,post_clicks,post_reactions_by_type_total).period(lifetime)'
        )
        
        data = response.dig('insights', 'data') || []
        
        metrics = {
          impressions: 0,
          clicks: 0,
          reactions: 0,
          spend: 0.0,
          updated_at: Time.current
        }

        # Extract from insights
        data.each do |metric|
          name = metric['name']
          values = metric['values']
          next if values.blank?
          
          value = values.first['value']
          
          case name
          when 'post_impressions'
            # We take the max between impressions and what we already have
            metrics[:impressions] = [metrics[:impressions], value.to_i].max
          when 'post_impressions_unique'
            # Sometimess 'unique' is what the user sees as 'Impresiones' or 'Spectators'
            metrics[:impressions] = [metrics[:impressions], value.to_i].max
          when 'post_clicks'
            metrics[:clicks] = value.to_i
          when 'post_reactions_by_type_total'
            metrics[:reactions] = value.values.sum if value.is_a?(Hash)
          end
        end

        # If still 0, it might be the token. Let's log it.
        if metrics[:impressions] == 0 && metrics[:reactions] == 0
          Rails.logger.info "MetricsFetcher: Still 0 for post #{full_post_id}. Token type used: #{access_token.include?('EA') ? 'Likely User' : 'Likely Page'}"
        end

        @post.update(metrics: metrics)
        metrics
      rescue Koala::Facebook::ClientError => e
        Rails.logger.error "MetricsFetcher Error for post #{@post.id}: #{e.message}"
        nil
      end
    end
  end
end
