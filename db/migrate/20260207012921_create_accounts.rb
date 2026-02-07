class CreateAccounts < ActiveRecord::Migration[7.1]
  def change
    create_table :accounts do |t|
      t.string :name, null: false
      t.integer :account_type, default: 0, null: false
      t.string :billing_email
      t.string :country_code, null: false
      t.string :currency_name
      t.string :currency_symbol
      t.string :address
      t.string :postal_code
      t.string :city
      t.string :phone_number
      t.string :stripe_customer_id
      t.references :plan, null: true, foreign_key: true
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end
