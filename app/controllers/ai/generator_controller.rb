module Ai
  class GeneratorController < ApplicationController
    before_action :authenticate_user!

    def forge
      if params[:prompt].blank?
        return render json: { error: "El prompt no puede estar vacío" }, status: :unprocessable_entity
      end

      generator = Ai::GeneratorService.new
      campaign = generator.generate_campaign(params[:prompt])

      render json: campaign
    end
  end
end
