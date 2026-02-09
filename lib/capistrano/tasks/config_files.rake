namespace :config_files do
  desc 'Upload configuration files to server'
  task :upload do
    on roles(:app) do
      execute "mkdir -p #{shared_path}/config"
      upload! StringIO.new(File.read('config/master.key')), "#{shared_path}/config/master.key"
      upload! StringIO.new(File.read('config/database.yml')), "#{shared_path}/config/database.yml"
      upload! StringIO.new(File.read('config/application.yml')), "#{shared_path}/config/application.yml"
      upload! StringIO.new(File.read('config/sidekiq.yml')), "#{shared_path}/config/sidekiq.yml"
      if File.exist?('frontend/.env.production')
        upload! StringIO.new(File.read('frontend/.env.production')), "#{shared_path}/frontend_env_production"
      end
    end
  end
end
