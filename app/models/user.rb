class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :trackable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_one_attached :profile_image

  enum role: { advertiser: 0, superadmin: 1 }

  after_initialize :set_default_role, if: :new_record?

  def set_default_role
    self.role ||= :advertiser
  end

  validates :timezone, inclusion: { in: ActiveSupport::TimeZone.all.map(&:name) }
end
