class Campaign < ApplicationRecord
  belongs_to :account
  has_many :campaign_posts, dependent: :destroy

  enum status: { draft: 0, active: 1, archived: 2 }

  validates :name, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["id", "name", "description", "status", "created_at", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["account", "campaign_posts"]
  end
end
