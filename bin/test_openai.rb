require 'openai'
require 'dotenv/load'

client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])

begin
  puts "--- Testing OpenAI Key ---"
  response = client.chat(
    parameters: {
      model: "gpt-4o",
      messages: [{ role: "user", content: "Say hi" }],
      max_tokens: 5
    }
  )
  content = response.dig("choices", 0, "message", "content")
  if content
    puts "✅ SUCCESS: #{content.strip}"
  else
    puts "❌ ERROR: Response but no content. #{response.inspect}"
  end
rescue => e
  puts "❌ ERROR: #{e.message}"
end
