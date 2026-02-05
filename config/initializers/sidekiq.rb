Sidekiq.configure_server do |config|
  config.redis = { 
    url: ENV.fetch('REDIS_URL') { 'redis://localhost:6379/1' },
    namespace: ENV.fetch('REDIS_NAMESPACE') { 'laniakea' }
  }
end

Sidekiq.configure_client do |config|
  config.redis = { 
    url: ENV.fetch('REDIS_URL') { 'redis://localhost:6379/1' },
    namespace: ENV.fetch('REDIS_NAMESPACE') { 'laniakea' }
  }
end
