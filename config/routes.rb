Rails.application.routes.draw do
  devise_for :users

  authenticated :user do
    resource :user, only: :show
    get '/tickets/all_status', to: 'tickets#all_status'
    root 'tickets#index', as: :authenticated_root
    resources :tickets
    resources :comments, only: %i[create destroy]
    get '/comments/by_ticket/:id', to: 'comments#by_ticket'
    get '/users/all', to: 'users#all'
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
