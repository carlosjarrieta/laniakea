class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :account

  enum role: { member: 0, admin: 1, owner: 2 }
  enum status: { invited: 0, active: 1 }

  validates :user_id, uniqueness: true
end
