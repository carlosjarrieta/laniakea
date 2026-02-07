class AddTaxIdToAccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :tax_id, :string
  end
end
