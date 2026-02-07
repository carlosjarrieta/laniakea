class CreatePlans < ActiveRecord::Migration[7.1]
  def change
    create_table :plans do |t|
      t.string :name, null: false
      t.integer :price_cents, default: 0, null: false
      t.string :currency, default: 'USD', null: false
      t.string :interval, default: 'monthly', null: false
      t.jsonb :features, default: {}, null: false
      t.string :stripe_price_id
      t.boolean :active, default: true, null: false

      t.timestamps
    end
  end
end
