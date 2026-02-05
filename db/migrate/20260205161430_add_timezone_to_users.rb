class AddTimezoneToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :timezone, :string, null: false, default: 'UTC'
  end
end
