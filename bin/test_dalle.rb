require 'openai'
require 'dotenv/load'

client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])

begin
  puts "--- Testing DALL-E 3 ---"
  response = client.images.generate(
    parameters: {
      model: "dall-e-3",
      prompt: "A professional cinematic shot of a modern English football match, rainy stadium lights, high definition",
      size: "1024x1024",
      quality: "standard",
      n: 1
    }
  )
  url = response.dig("data", 0, "url")
  if url
    puts "✅ SUCCESS! Image URL: #{url}"
  else
    puts "❌ ERROR: No URL in response. #{response.inspect}"
  end
rescue => e
  puts "❌ ERROR: #{e.message}"
end
