require 'gemini-ai'
require 'openai'
require 'base64'

module Ai
  class GeneratorService
    def initialize(model: 'gemini')
      @model_choice = model
      Rails.logger.info "Initializing Ai::GeneratorService with model: #{@model_choice}"
      
      case @model_choice
      when 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'
        @client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
      when 'grok', 'grok-2'
        @client = OpenAI::Client.new(
          access_token: ENV['GROK_API_KEY'],
          uri_base: "https://api.x.ai"
        )
      else
        # Allow specific gemini model names or default to gemini-flash-latest
        gemini_model = if @model_choice == 'gemini' || @model_choice == 'gemini-flash'
                         'gemini-flash-latest'
                       elsif @model_choice == 'gemini-pro'
                         'gemini-pro-latest'
                       else
                         @model_choice # fallback for direct model names
                       end

        @client = Gemini.new(
          credentials: {
            service: 'generative-language-api',
            api_key: ENV['GEMINI_API_KEY'],
            version: 'v1beta'
          },
          options: { 
            model: gemini_model, 
            server_sent_events: false 
          }
        )
      end
    end

    def generate_campaign(prompt, image: nil)
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

      if @model_choice.start_with?('gpt')
        response = call_openai(system_prompt, prompt, image)
      elsif @model_choice.start_with?('grok')
        response = call_grok(system_prompt, prompt) # Grok vision not widely available via OpenAI lib yet
      else
        response = call_gemini(system_prompt, prompt, image)
      end

      # Limpiar bloques de código markdown si existen
      json_content = response.gsub(/```json\s*|```/, '').strip
      campaign_data = JSON.parse(json_content)

      # Generar imágenes reales si estamos usando OpenAI y NO subieron imagen
      # Si subieron imagen, podríamos usarla como base, pero de momento
      # si hay imagen de usuario, quizás no necesitemos generar una nueva o sí.
      # Por simplicidad: solo generamos con DALL-E si NO hay imagen de usuario.
      if @model_choice.start_with?('gpt') && !image
        campaign_data['posts'].each_with_index do |post, index|
          image_prompt = post['image_prompt'] || post['video_prompt']
          if image_prompt.present?
            Rails.logger.info "Generating DALL-E 3 image for post #{index + 1}..."
            post['real_image_url'] = generate_image_dalle(image_prompt)
          end
        end
      end

      campaign_data
    rescue => e
      Rails.logger.error "AI Generator Error (#{@model_choice}): #{e.message}"
      { error: "No pudimos forjar la campaña en este momento con #{@model_choice}: #{e.message}" }
    end

    private

    def generate_image_dalle(prompt)
      response = @client.images.generate(
        parameters: {
          model: "dall-e-3",
          prompt: "Professional advertisement visual: #{prompt}",
          size: "1024x1024",
          quality: "standard",
          n: 1
        }
      )
      response.dig("data", 0, "url")
    rescue => e
      Rails.logger.error "DALL-E 3 Error: #{e.message}"
      nil
    end

    def call_gemini(system_prompt, prompt, image)
      contents = [
        { role: 'user', parts: [{ text: "Contexto del Sistema: #{system_prompt}" }] }
      ]

      user_parts = [{ text: "Idea de campaña: #{prompt}" }]
      
      if image
        image_data = Base64.strict_encode64(image.read)
        user_parts << {
          inline_data: {
            mime_type: image.content_type,
            data: image_data
          }
        }
        user_parts << { text: "IMPORTANTE: Analiza la imagen adjunta para que el contenido sea 100% relevante a este producto/referencia." }
      end

      contents << { role: 'user', parts: user_parts }

      response = @client.generate_content({ contents: contents })

      json_string = response.dig('candidates', 0, 'content', 'parts', 0, 'text') || 
                    response.dig(0, 'candidates', 0, 'content', 'parts', 0, 'text') || ""
      
      raise "Gemini devolvió una respuesta vacía" if json_string.empty?

      json_string
    end

    def call_openai(system_prompt, prompt, image)
      user_content = [{ type: "text", text: "Idea de campaña: #{prompt}. IMPORTANTE: Responde solo con JSON." }]

      if image
        image_data = Base64.strict_encode64(image.read)
        user_content << {
          type: "image_url",
          image_url: {
            url: "data:#{image.content_type};base64,#{image_data}"
          }
        }
        user_content << { type: "text", text: "Analiza esta imagen adjunta para basar toda la campaña en ella." }
      end

      response = @client.chat(
        parameters: {
          model: @model_choice,
          messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: user_content }
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        }
      )

      json_string = response.dig("choices", 0, "message", "content")
      raise "OpenAI devolvió una respuesta vacía" if json_string.blank?

      json_string
    end

    def call_grok(system_prompt, prompt)
      response = @client.chat(
        parameters: {
          model: "grok-beta",
          messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: "Idea de campaña: #{prompt}" }
          ],
          temperature: 0.7
        }
      )

      json_string = response.dig("choices", 0, "message", "content")
      raise "Grok devolvió una respuesta vacía" if json_string.blank?

      json_string
    end
  end
end
