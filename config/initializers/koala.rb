Koala.configure do |config|
  config.api_version = ENV['FACEBOOK_API_VERSION'] || "v24.0"
end
