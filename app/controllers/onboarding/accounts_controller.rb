module Onboarding
  class AccountsController < ApplicationController
    before_action :authenticate_user!

    def create
      if current_user.membership.present?
         return render json: { 
           status: { code: 422, message: 'User already belongs to an account.' } 
         }, status: :unprocessable_entity
      end

      account = Account.new(account_params)
      
      ActiveRecord::Base.transaction do
        if account.save
          Membership.create!(
            user: current_user,
            account: account,
            role: :owner,
            status: :active
          )
          
          render json: {
            status: { 
              code: 200, 
              message: 'Account created successfully.', 
              data: account 
            }
          }, status: :ok
        else
          render json: {
            status: { 
              code: 422, 
              message: account.errors.full_messages.to_sentence, 
              errors: account.errors.full_messages 
            }
          }, status: :unprocessable_entity
        end
      end
    rescue => e
      render json: {
        status: { 
          code: 500, 
          message: e.message 
        }
      }, status: :internal_server_error
    end

    private

    def account_params
      params.require(:account).permit(
        :name, :account_type, :country_code, :billing_email, 
        :tax_id, :phone_number, :address, :city, :postal_code
      )
    end
  end
end
