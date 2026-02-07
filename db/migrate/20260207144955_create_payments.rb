class CreatePayments < ActiveRecord::Migration[7.2]
  def change
    create_table :payments do |t|
      t.references :account, null: false, foreign_key: true
      t.string :stripe_payment_intent_id
      t.string :stripe_invoice_id
      t.integer :amount_cents
      t.string :currency
      t.string :status
      t.datetime :payment_date
      t.jsonb :metadata

      t.timestamps
    end
    add_index :payments, :stripe_payment_intent_id
    add_index :payments, :stripe_invoice_id
  end
end
