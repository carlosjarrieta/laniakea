module Ai
  class SegmentationService
    def initialize(description, model: 'gpt-4o')
      @description = description
      @model_choice = model
      
      case @model_choice
      when 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'
        @client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
      when 'grok', 'grok-2'
        @client = OpenAI::Client.new(
          access_token: ENV['GROK_API_KEY'],
          uri_base: "https://api.x.ai"
        )
      else
        @client = Gemini.new(
          credentials: {
            service: 'generative-language-api',
            api_key: ENV['GEMINI_API_KEY'],
            version: 'v1beta'
          },
          options: { 
            model: @model_choice, 
            server_sent_events: false 
          }
        )
      end
    end

    def generate_targeting
      prompt = <<~PROMPT
        Act as a Facebook Ads Specialist. Translate the following audience description into a structured JSON for Facebook Targeting Parameters.
        Description: "#{@description}"
        
        Return ONLY valid JSON with this exact structure:
        {
          "interests": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
          "age_range": [18, 65],
          "genders": ["male", "female"],
          "locations": ["Colombia", "Mexico"],
          "behaviors": ["Online Shoppers"]
        }
        Do not include markdown formatting, code blocks, or explanations. Just the JSON string.
      PROMPT

      begin
        response = if @model_choice.start_with?('gpt') || @model_choice.start_with?('grok')
                     call_openai(prompt)
                   else
                     call_gemini(prompt)
                   end

        # Clean json
        json_string = response.gsub(/```json\s*|```/, '').strip
        JSON.parse(json_string)
      rescue => e
        Rails.logger.error "AI Segmentation Error: #{e.message}"
        {
          "interests" => ["Business", "Technology"],
          "age_range" => [18, 65],
          "locations" => ["Global"],
          "fallback" => true,
          "error" => e.message
        }
      end
    end

    private

    def call_gemini(prompt)
      response = @client.generate_content({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })

      response.dig('candidates', 0, 'content', 'parts', 0, 'text') || 
      response.dig(0, 'candidates', 0, 'content', 'parts', 0, 'text') || ""
    end

    def call_openai(prompt)
      response = @client.chat(
        parameters: {
          model: @model_choice == 'grok' ? 'grok-beta' : @model_choice,
          messages: [
            { role: "system", content: "You are a Facebook Ads Specialist. Return only JSON." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        }
      )
      response.dig("choices", 0, "message", "content") || ""
    end
  end
end
