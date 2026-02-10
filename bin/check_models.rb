require 'net/http'
require 'uri'
require 'json'

key = ENV['GEMINI_API_KEY']
url = URI("https://generativelanguage.googleapis.com/v1beta/models?key=#{key}")

puts "Consultando modelos disponibles..."
response = Net::HTTP.get_response(url)

if response.is_a?(Net::HTTPSuccess)
  models = JSON.parse(response.body)['models']
  puts "Modelos encontrados:"
  models.each do |m|
    puts "- #{m['name']} (Soporta: #{m['supportedGenerationMethods'].join(', ')})"
  end
else
  puts "Error al consultar: #{response.code} #{response.message}"
  puts response.body
end
