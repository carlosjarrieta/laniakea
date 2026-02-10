require 'gemini-ai'

module Ai
  class GeneratorService
    def initialize
      Rails.logger.info "Initializing Ai::GeneratorService with gemini-flash-latest"
      @client = Gemini.new(
        credentials: {
          service: 'generative-language-api',
          api_key: ENV['GEMINI_API_KEY'],
          version: 'v1beta'
        },
        options: { 
          model: 'gemini-flash-latest', 
          server_sent_events: false 
        }
      )
    end

    def generate_campaign(prompt)
      system_prompt = <<~PROMPT
        Eres un experto orquestador de anuncios y estratega de contenido para Laniakea.
        Tu objetivo es transformar una idea simple en una campaña multicanal efectiva.
        
        IMPORTANTE: Debes responder ÚNICAMENTE con un objeto JSON válido, sin texto adicional antes ni después.
        
        La estructura del JSON debe ser:
        {
          "campaign_name": "Nombre creativo de la campaña",
          "posts": [
            {
              "platform": "Instagram",
              "copy": "Texto optimizado para Instagram...",
              "image_prompt": "Prompt artístico detallado para generar la imagen principal...",
              "hashtags": ["#tag1", "#tag2"]
            },
            {
              "platform": "Facebook",
              "copy": "Texto persuasivo para Facebook...",
              "image_prompt": "Prompt visual para el post de Facebook...",
              "hashtags": ["#tag1"]
            },
            {
              "platform": "LinkedIn",
              "copy": "Texto profesional para LinkedIn...",
              "image_prompt": "Imagen corporativa/profesional relacionada...",
              "hashtags": ["#tag1"]
            },
            {
              "platform": "TikTok",
              "copy": "Guion rápido para TikTok...",
              "video_prompt": "Descripción visual para generar un video o reel...",
              "hashtags": ["#tag1"]
            }
          ],
          "target_audience": "Descripción del público objetivo",
          "estimated_roi": "X.Xx"
        }
      PROMPT

      response = @client.generate_content({
        contents: [
          { role: 'user', parts: [{ text: "Contexto del Sistema: #{system_prompt}" }] },
          { role: 'user', parts: [{ text: "Idea de campaña: #{prompt}" }] }
        ]
      })

      # Extraer el texto de la respuesta
      json_string = response.dig('candidates', 0, 'content', 'parts', 0, 'text') || 
                    response.dig(0, 'candidates', 0, 'content', 'parts', 0, 'text') || ""
      
      if json_string.empty?
        Rails.logger.error "AI Empty Response: #{response.inspect}"
        raise "La IA devolvió una respuesta vacía"
      end

      # Limpiar bloques de código markdown
      json_content = json_string.gsub(/```json\s*|```/, '').strip

      JSON.parse(json_content)
    rescue => e
      Rails.logger.error "AI Generator Error: #{e.message}"
      { error: "No pudimos forjar la campaña en este momento: #{e.message}" }
    end
  end
end
