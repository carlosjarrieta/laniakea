class Campaign < ApplicationRecord
  belongs_to :account
  has_many :campaign_posts, dependent: :destroy
  has_one :ad_campaign, dependent: :destroy
  
  enum status: { draft: 0, active: 1, archived: 2 }

  validates :name, presence: true
  validates :daily_budget, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :max_spend, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  def self.ransackable_attributes(auth_object = nil)
    ["id", "name", "description", "status", "created_at", "updated_at", "daily_budget", "max_spend"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["account", "campaign_posts", "ad_campaign"]
  end
end
