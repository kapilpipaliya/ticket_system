Rails.application.routes.draw do
  devise_for :users

  authenticated :user do
    root "pages#tickets", as: :authenticated_root
    resources :tickets
    resources :comments, only: [:create, :destroy]
  end

  unauthenticated do
    root 'pages#index'
    get '/new_ticket', to: 'pages#new_ticket'

  end
end
