Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :campaigns do
        resources :campaign_posts, only: [:index, :create]
      end
      resources :campaign_posts, only: [:update, :destroy]
      resources :integrations, only: [:index, :destroy] do
        collection do
          get :facebook_pages
        end
      end
      
      
      # Facebook Auth directo (sin OmniAuth)
      get 'facebook/auth_url', to: 'facebook_auth#auth_url'
      get 'facebook/callback', to: 'facebook_auth#callback'
    end
  end
  mount ActionCable.server => '/cable'
  
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords',
    confirmations: 'users/confirmations',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  namespace :users do
    resource :profile, only: [:show, :update]
  end

  resource :account, only: [:show, :update]

  namespace :superadmin do
    resources :plans
    resources :accounts, only: [:index, :show, :update]
    resources :payments, only: [:index]
  end

  scope module: :onboarding do
    resources :accounts, only: [:create]
  end

  resources :plans, only: [:index, :show]
  resources :subscriptions, only: [] do
    collection do
      post :checkout
      post :portal
    end
  end
  resources :memberships, only: [:index, :destroy] do
    collection do
      post :invite
    end
    member do
      delete :cancel, to: 'memberships#cancel_invitation'
    end
  end
  get 'invitations/:token', to: 'memberships#show_invitation'
  post 'invitations/:token/accept', to: 'memberships#accept'
  get 'onboarding/countries', to: 'onboarding#countries'
  post 'onboarding', to: 'onboarding#create'
  post 'webhooks/stripe', to: 'webhooks#stripe'

  namespace :ai do
    post :forge, to: 'generator#forge'
  end


  resources :locales, only: [:show], constraints: { id: /en|es/ }

  get "up" => "rails/health#show", as: :rails_health_check
end
