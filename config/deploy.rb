lock '3.19.2'
set :application, 'laniakea'
set :repo_url, 'git@github.com:carlosjarrieta/laniakea.git' # Update with your repository URL
set :deploy_via, :copy
set :user, 'deploy'
set :rvm_ruby_version, '3.2.2'

set :deploy_to, '/home/deploy/www/laniakea'
set :linked_files, %w{config/database.yml config/master.key config/application.yml config/sidekiq.yml}
set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system storage}

set :keep_releases, 5

set :puma_threads, [4, 16]
set :puma_workers, 0

set :pty, true
set :use_sudo, false
set :deploy_via, :remote_cache
set :puma_bind, "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
set :puma_state, "#{shared_path}/tmp/pids/puma.state"
set :puma_pid, "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{release_path}/log/puma.access.log"
set :puma_error_log, "#{release_path}/log/puma.error.log"
set :ssh_options, { forward_agent: true, user: fetch(:user), keys: %w(~/.ssh/id_ed25519) }
set :puma_preload_app, true
set :puma_worker_timeout, nil
set :puma_init_active_record, true

# Skip assets compilation for API-only app (remove this line if you have assets)
set :assets_roles, []

# Puma configuration
set :puma_systemctl_user, :system


# Nginx configuration
set :nginx_frontend_domain, 'laniakea.tech'
set :nginx_api_domain, 'contabo.laniakea.tech'

# Hooks
before 'deploy:starting', 'config_files:upload'
after 'deploy:updated', 'frontend:deploy'
after 'deploy:published', 'sidekiq:restart'
