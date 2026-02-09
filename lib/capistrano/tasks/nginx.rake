namespace :nginx do
  desc 'Upload nginx configurations'
  task :upload_config do
    on roles(:app) do
      info '📝 Generating nginx configurations...'

      # API (Rails with Puma)
      api_config = <<~NGINX
        upstream puma_#{fetch(:application)} {
          server unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock fail_timeout=0;
        }

        server {
          listen 80;
          server_name #{fetch(:nginx_api_domain)};
          
          root #{current_path}/public;
          
          try_files $uri @puma;
          
          location @puma {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
            proxy_pass http://puma_#{fetch(:application)};
          }
          
          client_max_body_size 20M;
        }
      NGINX

      # FRONTEND (Next.js - Proxy to Node process on port 3000)
      frontend_config = <<~NGINX
        server {
          listen 80;
          server_name #{fetch(:nginx_frontend_domain)};

          location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
          }

          client_max_body_size 20M;
        }
      NGINX

      # Upload configs
      upload! StringIO.new(api_config), "/tmp/nginx_api"
      upload! StringIO.new(frontend_config), "/tmp/nginx_frontend"

      execute :sudo, :mv, "/tmp/nginx_api", "/etc/nginx/sites-available/#{fetch(:application)}_api"
      execute :sudo, :mv, "/tmp/nginx_frontend", "/etc/nginx/sites-available/#{fetch(:application)}_frontend"

      info '✓ Nginx configs uploaded'
    end
  end

  desc 'Enable sites'
  task :enable do
    on roles(:app) do
      execute :sudo, :ln, '-sf', "/etc/nginx/sites-available/#{fetch(:application)}_api", "/etc/nginx/sites-enabled/#{fetch(:application)}_api"
      execute :sudo, :ln, '-sf', "/etc/nginx/sites-available/#{fetch(:application)}_frontend", "/etc/nginx/sites-enabled/#{fetch(:application)}_frontend"
      info '✓ Sites enabled'
    end
  end

  desc 'Test and reload nginx'
  task :reload do
    on roles(:app) do
      execute :sudo, :nginx, '-t'
      execute :sudo, :systemctl, :reload, :nginx
      info '✓ Nginx reloaded'
    end
  end

  desc 'Setup everything'
  task :setup do
    invoke 'nginx:upload_config'
    invoke 'nginx:enable'
    invoke 'nginx:reload'
  end
end
