Rails.application.routes.draw do
  devise_for :users

  unauthenticated do
    namespace :api do
      namespace :v1 do
        resource :user, only: :show
        resources :tickets, only: %i[create]
      end
    end

    root 'pages#index'
    resources :tickets, only: %i[new]

  end

  authenticated :user do
    namespace :api do
      namespace :v1 do
        resource :user, only: :show
        get '/tickets/all_status', to: 'tickets#all_status'
        get '/tickets/all_status_filter', to: 'tickets#all_status_filter'
        resources :tickets, only: %i[index show create update destroy]

        resources :comments, only: %i[create update destroy]
        get '/comments/by_ticket/:id', to: 'comments#by_ticket'

        get '/users/all', to: 'users#all'

        get '/dashboard_api', to: 'dashboard#dashboard_data'
        get '/dashboard_static_api', to: 'dashboard#dashboard_static_data'
        get '/latest_activity', to: 'dashboard#latest_activity'
      end
    end
    root 'pages#dashboard', as: :authenticated_root
    resources :tickets, only: %i[index edit show]
    get '/dashboard', to: 'pages#dashboard'

  end


end
