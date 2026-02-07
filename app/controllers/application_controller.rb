class ApplicationController < ActionController::API
  around_action :set_time_zone, if: :current_user
  around_action :set_locale, if: :current_user

  rescue_from CanCan::AccessDenied do |exception|
    render json: { 
      status: { code: 403, message: "No tienes permiso para realizar esta acción." }
    }, status: :forbidden
  end

  private

  def set_time_zone(&block)
    Time.use_zone(current_user.timezone, &block)
  end

  def set_locale(&block)
    I18n.with_locale(current_user.locale, &block)
  end
end
