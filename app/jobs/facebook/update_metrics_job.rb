module Facebook
  class UpdateMetricsJob < ApplicationJob
    queue_as :default

    def perform(campaign_post_id)
      post = CampaignPost.find_by(id: campaign_post_id)
      return unless post

      Facebook::MetricsFetcher.new(post).call
    end
  end
end
