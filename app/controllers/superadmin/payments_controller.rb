class Superadmin::PaymentsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_superadmin!

  def index
    @payments = Payment.includes(:account).order(created_at: :desc)
    @total_earnings = Payment.where(status: 'succeeded').sum(:amount_cents)
    
    # Simple pagination if needed later, for now just list all or limit
    # @payments = @payments.limit(100)
  end

  private

  def ensure_superadmin!
    # Double check even if Ability handles it, or rely on Ability
    authorize! :manage, :all
  end
end
