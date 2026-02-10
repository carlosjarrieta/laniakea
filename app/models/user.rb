class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :omniauthable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_one_attached :profile_image
  
  has_one :membership, dependent: :destroy
  has_one :account, through: :membership
  has_many :connected_accounts, dependent: :destroy

  enum role: { advertiser: 0, superadmin: 1 }

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name
      user.confirmed_at = Time.now # Auto-confirm social users
      # user.image = auth.info.image # assuming the user model has an image
      # If you are using confirmable and the provider(s) you use validate emails, 
      # uncomment the line below to skip the confirmation emails.
      # user.skip_confirmation!
    end
  end

  after_initialize :set_default_role, if: :new_record?

  def set_default_role
    self.role ||= :advertiser
    self.skip_confirmation! if Rails.env.development?
  end

  validates :timezone, inclusion: { in: ActiveSupport::TimeZone.all.map(&:name) }
  validates :locale, inclusion: { in: I18n.available_locales.map(&:to_s) }

  def as_json(options = {})
    json = super(options)
    
    # Base account info
    json[:has_account] = account.present?
    json[:account_role] = membership&.role
    
    if superadmin?
      json[:has_active_plan] = true
    else
      json[:has_active_plan] = ['active', 'trialing'].include?(account&.status) && account&.plan_id.present?
    end

    # Pass plan features if they have an account
    if account&.plan
      json[:plan] = {
        name: account.plan.name,
        features: account.plan.features
      }
    end

    json
  end
end

