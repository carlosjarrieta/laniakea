class Invitation < ApplicationRecord
  belongs_to :account

  enum role: { member: 0, admin: 1 }

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: { scope: :account_id, message: "ya ha sido invitado a esta cuenta" }
  validates :token, uniqueness: true

  before_create :generate_token

  private

  def generate_token
    self.token = SecureRandom.hex(20)
  end
end
