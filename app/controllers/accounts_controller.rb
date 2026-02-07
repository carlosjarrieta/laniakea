class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account

  def show
    render json: @account
  end

  def update
    if @account.update(account_params)
      render json: {
        message: 'Cuenta actualizada correctamente',
        account: @account
      }, status: :ok
    else
      render json: {
        message: @account.errors.full_messages.to_sentence
      }, status: :unprocessable_entity
    end
  end

  private

  def set_account
    @account = current_user.account
    render json: { error: 'No account found' }, status: :not_found unless @account
  end

  def account_params
    params.require(:account).permit(
      :name, :account_type, :billing_email, :country_code, 
      :address, :city, :postal_code, :phone_number, :tax_id
    )
  end
end
