class Users::ProfilesController < ApplicationController
  before_action :authenticate_user!
  respond_to :json

  def show
    render json: current_user.as_json(
      only: [:id, :email, :name, :role, :timezone, :locale, :theme_color],
      include: { account: { only: [:id, :name, :account_type, :status] } }
    ), status: :ok
  end

  def update
    if current_user.update(profile_params)
      render json: {
        message: I18n.t('users.profiles.updated'),
        user: current_user.as_json(
          only: [:id, :email, :name, :role, :timezone, :locale, :theme_color],
          include: { account: { only: [:id, :name, :account_type, :status] } }
        )
      }, status: :ok
    else
      render json: {
        message: current_user.errors.full_messages.to_sentence
      }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:user).permit(:name, :email, :timezone, :locale, :password, :password_confirmation, :theme_color)
  end
end
