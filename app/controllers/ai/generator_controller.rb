module Ai
  class GeneratorController < ApplicationController
    before_action :authenticate_user!

    def forge
      if params[:prompt].blank?
        return render json: { error: "El prompt no puede estar vacío" }, status: :unprocessable_entity
      end

      model = params[:model] || 'gemini'
      image = params[:image]
      generator = Ai::GeneratorService.new(model: model)
      campaign = generator.generate_campaign(params[:prompt], image: image)

      render json: campaign
    end

    def segment
      if params[:prompt].blank?
        return render json: { error: "El prompt no puede estar vacío" }, status: :unprocessable_entity
      end

      model = params[:model] || 'gpt-4o'
      service = Ai::SegmentationService.new(params[:prompt], model: model)
      result = service.generate_targeting
      
      render json: result
    end
  end
end
