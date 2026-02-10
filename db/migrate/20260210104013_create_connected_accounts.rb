class CreateConnectedAccounts < ActiveRecord::Migration[7.2]
  def change
    create_table :connected_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider
      t.string :uid
      t.text :access_token
      t.text :refresh_token
      t.datetime :expires_at
      t.string :name
      t.string :image
      t.jsonb :metadata

      t.timestamps
    end
  end
end
