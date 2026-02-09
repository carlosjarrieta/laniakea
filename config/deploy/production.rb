server "contabo.laniakea.tech", user: 'deploy', roles: %w[web app db worker], primary: 'true'
set :branch, 'main'
set :stage, :production
set :rails_env, :production

set :sidekiq_service_unit_name, 'sidekiq-laniakea_production'
