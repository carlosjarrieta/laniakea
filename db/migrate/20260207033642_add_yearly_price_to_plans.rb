class AddYearlyPriceToPlans < ActiveRecord::Migration[7.1]
  def change
    add_column :plans, :price_cents_yearly, :integer
    add_column :plans, :stripe_yearly_price_id, :string
  end
end
