source "https://rubygems.org"

ruby "3.2.2"
gem 'rails', '~> 7.2', '>= 7.2.3'
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "tzinfo-data", platforms: %i[ mswin mswin64 mingw x64_mingw jruby ]
gem "bootsnap", require: false
gem "image_processing", "~> 1.2"

gem "figaro", "~> 1.3"
gem "rack-cors"
gem "aws-sdk-s3", "~> 1.213"
gem "countries"
gem "stripe"
gem "jbuilder"

# Background Jobs
gem "sidekiq", "~> 8.1"
gem "redis", "~> 5.4"
gem "redis-namespace", "~> 1.11"

# security and roles
gem "cancancan", "~> 3.6"
gem "devise", "~> 5.0"
gem "devise-jwt", "~> 0.13.0"

# AI tools
gem 'gemini-ai'


group :development, :test do
  gem "letter_opener", "~> 1.10"
  gem "pry-rails"
  gem "bullet", "~> 8.1"
end

group :development do
  gem 'capistrano', '3.19.2'
  gem 'capistrano-bundler', require: false
  gem 'capistrano-rails', require: false
  gem 'capistrano-rvm', github: 'capistrano/rvm', require: false
  gem 'capistrano-ssh-doctor', require: false
  gem 'capistrano3-puma', '~> 7.1'
  gem 'capistrano3-nginx', '~> 3.0'
  gem 'capistrano-upload-config', '~> 0.9.0'
  gem 'capistrano-sidekiq'
  gem 'ed25519', '~> 1.2'
  gem 'bcrypt_pbkdf', '~> 1.1'
end
gem "ruby-openai", "~> 8.3"
