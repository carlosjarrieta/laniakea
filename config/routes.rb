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
    resource :billing_info, only: [:show, :update]
  end


  resources :locales, only: [:show], constraints: { id: /en|es/ }

  get "up" => "rails/health#show", as: :rails_health_check
end
