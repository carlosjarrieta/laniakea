class OnboardingController < ApplicationController
  before_action :authenticate_user!

  def countries
    render json: ISO3166::Country.all.map { |c| { name: c.translations[I18n.locale.to_s] || c.name, code: c.alpha2 } }.sort_by { |c| c[:name] }
  end

  def create
    Account.transaction do
      @account = Account.create!(account_params)
      @membership = Membership.create!(
        user: current_user,
        account: @account,
        role: :owner,
        status: :active
      )
      render json: { account: @account, membership: @membership }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors }, status: :unprocessable_entity
  end

  private

  def account_params
    params.require(:account).permit(:name, :account_type, :billing_email, :country_code, :address, :city, :postal_code, :phone_number)
  end
end
