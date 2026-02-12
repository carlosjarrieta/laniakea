class AddAdsFieldsToCampaignsAndCreateAdCampaigns < ActiveRecord::Migration[7.2]
  def change
    add_column :campaigns, :daily_budget, :decimal, precision: 10, scale: 2
    add_column :campaigns, :max_spend, :decimal, precision: 10, scale: 2
    add_column :campaigns, :target_audience_description, :text

    create_table :ad_campaigns do |t|
      t.references :campaign, null: false, foreign_key: true
      t.integer :status, default: 0 # draft
      t.string :facebook_campaign_id
      t.string :facebook_ad_set_id
      t.string :facebook_ad_id
      t.decimal :budget, precision: 10, scale: 2
      t.jsonb :metadata, default: {}

      t.timestamps
    end
  end
end
