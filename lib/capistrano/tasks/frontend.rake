namespace :frontend do
  desc 'Check if frontend directory exists'
  task :check do
    on roles(:app) do
      if test("[ -d #{release_path}/frontend ]")
        info '✓ Frontend directory found'
      else
        warn '⚠ Frontend directory not found, skipping frontend tasks'
        invoke 'frontend:skip'
      end
    end
  end

  desc 'Skip frontend deployment'
  task :skip do
    # Placeholder task to skip frontend deployment
  end

  desc 'Link frontend environment file'
  task :link_env do
    on roles(:app) do
      env_file = "#{shared_path}/frontend_env_production"
      if test("[ -f #{env_file} ]")
        execute :ln, '-sf', env_file, "#{release_path}/frontend/.env.production"
        info '✓ Linked frontend .env.production'
      else
        warn '⚠ frontend_env_production not found in shared directory'
      end
    end
  end

  desc 'Install frontend dependencies'
  task :yarn_install do
    on roles(:app) do
      within "#{release_path}/frontend" do
        info '📦 Installing frontend dependencies...'
        execute :yarn, 'install'
      end
    end
  end

  desc 'Build frontend for production'
  task :build do
    on roles(:app) do
      within "#{release_path}/frontend" do
        with node_env: :production do
          info '🏗️  Building frontend...'
          execute :yarn, 'build'
          info '✓ Frontend build completed'
        end
      end
    end
  end

  desc 'Deploy frontend (complete workflow)'
  task :deploy do
    invoke 'frontend:check'
    invoke 'frontend:link_env'
    invoke 'frontend:yarn_install'
    invoke 'frontend:build'
  end

  namespace :systemd do
    desc 'Setup frontend systemd service'
    task :config do
      on roles(:app) do
        service_content = <<~SERVICE
          [Unit]
          Description=Laniakea Frontend (Next.js)
          After=network.target

          [Service]
          Type=simple
          User=#{fetch(:user)}
          WorkingDirectory=#{current_path}/frontend
          Environment=NODE_ENV=production
          ExecStart=/usr/bin/yarn start
          Restart=always

          [Install]
          WantedBy=default.target
        SERVICE

        upload! StringIO.new(service_content), "/tmp/laniakea_frontend.service"
        execute :mkdir, '-p', "~/.config/systemd/user"
        execute :mv, "/tmp/laniakea_frontend.service", "~/.config/systemd/user/laniakea_frontend.service"
        execute :"/bin/systemctl --user", :"daemon-reload"
        execute :"/bin/systemctl --user", :enable, :laniakea_frontend
      end
    end

    desc 'Restart frontend service'
    task :restart do
      on roles(:app) do
        execute :"/bin/systemctl --user", :restart, :laniakea_frontend
      end
    end
  end
end

after 'deploy:published', 'frontend:systemd:restart'

after 'deploy:updated', 'frontend:deploy'
