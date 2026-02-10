require 'gemini-ai'

def test_model(name)
  client = Gemini.new(
    credentials: {
      service: 'generative-language-api',
      api_key: ENV['GEMINI_API_KEY'],
      version: 'v1beta'
    },
    options: { model: name, server_sent_events: false }
  )

  print "Testing #{name}... "
  begin
    response = client.generate_content({
      contents: [{ role: 'user', parts: [{ text: 'hi' }] }]
    })
    puts "✅ AVAILABLE"
    return true
  rescue => e
    puts "❌ ERROR: #{e.message}"
    return false
  end
end

models_to_test = [
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-pro',
  'gemini-1.5-flash'
]

puts "--- Model Availability Check ---"
models_to_test.each { |m| test_model(m) }
puts "-------------------------------"
