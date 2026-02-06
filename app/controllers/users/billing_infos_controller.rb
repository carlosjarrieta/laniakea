class Users::BillingInfosController < ApplicationController
  before_action :authenticate_user!

  def show
    billing_info = current_user.billing_info || current_user.build_billing_info
    render json: billing_info, status: :ok
  end

  def update
    billing_info = current_user.billing_info || current_user.build_billing_info
    if billing_info.update(billing_info_params)
      render json: {
        message: I18n.t('users.billing_infos.updated'),
        billing_info: billing_info
      }, status: :ok
    else
      render json: {
        message: billing_info.errors.full_messages.to_sentence
      }, status: :unprocessable_entity
    end
  end

  private

  def billing_info_params
    params.require(:billing_info).permit(:tax_id, :company_name, :address, :city, :zip_code, :country)
  end
end
