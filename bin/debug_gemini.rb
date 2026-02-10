begin
  # Intentar instanciar el cliente
  puts "Checking ENV..."
  puts "KEY Present: #{ENV['GEMINI_API_KEY'].present?}"

  client = Gemini.new(
    credentials: {
      service: 'generative-language-api',
      api_key: ENV['GEMINI_API_KEY'],
      version: 'v1beta'
    }
  )

  puts "Client class: #{client.class}"
  
  # Try listing models via REST if gem fails
  require 'net/http'
  require 'uri'
  require 'json'

  url = URI("https://generativelanguage.googleapis.com/v1beta/models?key=#{ENV['GEMINI_API_KEY']}")
  response = Net::HTTP.get(url)
  puts "Raw REST API Response (Models):"
  puts response[0..500] # Show first 500 chars

rescue => e
  puts "ERROR: #{e.message}"
  puts e.backtrace
end
