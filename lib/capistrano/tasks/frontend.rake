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
        execute :yarn, 'install', '--frozen-lockfile'
      end
    end
  end

  desc 'Build frontend for production'
  task :build do
    on roles(:app) do
      within "#{release_path}/frontend" do
        # Aumentamos el límite de memoria para Node ya que el VPS tiene 8GB
        # También nos aseguramos de que se use el entorno de producción
        with node_env: :production, node_options: "--max-old-space-size=4096" do
          info '🏗️  Building frontend (Next.js)...'
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
    # HE ELIMINADO LA TAREA 'config' QUE CAUSABA EL CONFLICTO
    # Ya no intentará crear archivos de servicio ni pedir sudo.

    desc 'Restart frontend service'
    task :restart do
      on roles(:app) do
        # Esto solo reinicia el proceso, que es lo único que necesitas al desplegar
        execute :"/bin/systemctl --user", :restart, :laniakea_frontend
      end
    end
  end
end

# Hooks
after 'deploy:published', 'frontend:systemd:restart'
after 'deploy:updated', 'frontend:deploy'