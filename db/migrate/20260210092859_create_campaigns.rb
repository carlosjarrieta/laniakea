class CreateCampaigns < ActiveRecord::Migration[7.2]
  def change
    create_table :campaigns do |t|
      t.string :name
      t.text :description
      t.references :account, null: false, foreign_key: true
      t.integer :status
      t.jsonb :metadata

      t.timestamps
    end
  end
end
