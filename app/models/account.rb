class Account < ApplicationRecord
  belongs_to :plan, optional: true
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :invitations, dependent: :destroy
  has_one :owner_membership, -> { where(role: :owner) }, class_name: 'Membership'
  has_one :owner, through: :owner_membership, source: :user

  enum account_type: { individual: 0, company: 1 }
  enum status: { trialing: 0, active: 1, past_due: 2, canceled: 3 }

  validates :name, presence: true
  validates :country_code, presence: true
  validates :billing_email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
end
