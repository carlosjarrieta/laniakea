class AddLimitsToPlans < ActiveRecord::Migration[7.1]
  def change
    add_column :plans, :max_users, :integer, default: 1, null: false
    add_column :plans, :max_social_profiles, :integer, default: 5, null: false
  end
end
