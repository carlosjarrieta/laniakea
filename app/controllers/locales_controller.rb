class LocalesController < ApplicationController
  # No es necesario estar logueado para ver las traducciones (útil para la PWA)
  skip_before_action :authenticate_user!, raise: false

  def show
    locale = params[:id]
    
    if I18n.available_locales.include?(locale.to_sym)
      # I18n.t('.') nos devuelve todo el hash de traducciones para ese locale
      translations = I18n.t('.', locale: locale)
      render json: translations
    else
      render json: { 
        error: "Locale '#{locale}' not supported. Available locales: #{I18n.available_locales.join(', ')}" 
      }, status: :not_found
    end
  end
end
