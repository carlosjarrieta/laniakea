class Plan < ApplicationRecord
  has_many :accounts
  
  validates :name, presence: true
  validates :price_cents, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :price_cents_yearly, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :currency, presence: true
  # validates :interval, presence: true
end
