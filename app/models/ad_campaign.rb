class AdCampaign < ApplicationRecord
  belongs_to :campaign
  
  enum status: { draft: 0, active: 1, paused: 2, completed: 3, archived: 4 }

  validates :status, presence: true
  validates :budget, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  # Ransack configuration for admin dashboard
  def self.ransackable_attributes(auth_object = nil)
    ["id", "status", "budget", "facebook_campaign_id", "created_at", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["campaign"]
  end
end
