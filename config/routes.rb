Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords'
  }

  namespace :users do
    resource :profile, only: [:show, :update]
  end

  resource :account, only: [:show, :update]

  namespace :superadmin do
    resources :plans
    resources :accounts, only: [:index, :show, :update]
  end

  resources :plans, only: [:index, :show]
  get 'onboarding/countries', to: 'onboarding#countries'
  post 'onboarding', to: 'onboarding#create'
  post 'webhooks/stripe', to: 'webhooks#stripe'


  resources :locales, only: [:show], constraints: { id: /en|es/ }

  get "up" => "rails/health#show", as: :rails_health_check
end
