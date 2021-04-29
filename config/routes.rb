Rails.application.routes.draw do
  devise_for :users

  authenticated :user do
    root "tickets#index", as: :authenticated_root
    resources :tickets
    resources :comments, only: [:create, :destroy]
    get '/comments/by_ticket/:id', to: 'comments#by_ticket'
  end

  unauthenticated do
    root 'pages#index'
    resources :tickets, only: [:new, :create]
    get '/new_ticket', to: 'pages#new_ticket'
  end
end
