class CreateCampaignPosts < ActiveRecord::Migration[7.2]
  def change
    create_table :campaign_posts do |t|
      t.references :campaign, null: false, foreign_key: true
      t.string :platform
      t.text :content
      t.text :image_prompt
      t.string :image_url
      t.integer :status
      t.jsonb :metadata

      t.timestamps
    end
  end
end
