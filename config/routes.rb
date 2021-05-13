Rails.application.routes.draw do
  devise_for :users

  authenticated :user do
    get '/dashboard', to: 'pages#dashboard'
    resource :user, only: :show
    get '/tickets/all_status', to: 'tickets#all_status'
    get '/tickets/all_status_filter', to: 'tickets#all_status_filter'
    root 'pages#dashboard', as: :authenticated_root
    resources :tickets
    resources :comments, only: %i[create update destroy]
    get '/comments/by_ticket/:id', to: 'comments#by_ticket'
    get '/users/all', to: 'users#all'
    get '/dashboard_api', to: 'pages#dashboard_data'
    get '/dashboard_static_api', to: 'pages#dashboard_static_data'

  end

  unauthenticated do
    resource :user, only: :show
    root 'pages#index'
    resources :tickets, only: %i[new create]
    get '/new_ticket', to: 'pages#new_ticket'
    get '/tickets/all_status', to: 'tickets#all_status'
    get '/users/all', to: 'users#all'
  end
end
