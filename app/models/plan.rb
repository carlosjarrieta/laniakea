class Plan < ApplicationRecord
  has_many :accounts
  
  validates :name, presence: true
  validates :price_cents, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :price_cents_yearly, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :currency, presence: true
  before_validation :clean_features
  # validates :interval, presence: true

  private

  def clean_features
    return unless features.is_a?(Hash)

    self.features = features.select do |_, value|
      value.present? || value == false || value == 0
    end
  end
end
