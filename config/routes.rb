Rails.application.routes.draw do
  devise_for :users

  authenticated :user do
    root 'pages#dashboard', as: :authenticated_root

    namespace :api do
      namespace :v1 do
        resource :user, only: %i[show] do
          get 'all'
        end

        resources :tickets, only: %i[index show create update destroy] do
          collection do
            get 'all_status'
            get 'all_status_filter'
          end
        end

        resources :comments, only: %i[create update destroy] do
          get 'by_ticket', on: :member
        end

        resources :dashboard, only: %i[] do
          collection do
            get 'data'
            get 'static'
            get 'latest_activity'
          end
        end

      end
    end

    get '/dashboard', to: 'pages#dashboard'

    resources :tickets, only: %i[index edit show]

  end

  unauthenticated do
    root 'pages#index'

    namespace :api do
      namespace :v1 do
        resource :user, only: :show
        resources :tickets, only: %i[create]
      end
    end

    resources :tickets, only: %i[new]

  end
end
