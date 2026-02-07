class RemoveBillingInfos < ActiveRecord::Migration[7.1]
  def change
    drop_table :billing_infos
  end
end
