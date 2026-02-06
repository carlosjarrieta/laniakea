class CreateBillingInfos < ActiveRecord::Migration[7.1]
  def change
    create_table :billing_infos do |t|
      t.string :tax_id
      t.string :company_name
      t.string :address
      t.string :city
      t.string :zip_code
      t.string :country
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
