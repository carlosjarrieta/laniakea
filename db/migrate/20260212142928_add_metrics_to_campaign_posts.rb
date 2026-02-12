class AddMetricsToCampaignPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :campaign_posts, :metrics, :jsonb
  end
end
