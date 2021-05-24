Rails.application.routes.draw do
  devise_for :users

  authenticated :user do
    root 'pages#dashboard', as: :authenticated_root

    namespace :api do
      namespace :v1 do
        resources :users, only: %i[index] do
          collection do
            get 'profile'
          end
        end

        resources :tickets, only: %i[index show create update destroy] do
          collection do
            get 'all_status'
            get 'all_status_filter'
            get 'sentiments_options_filter'
          end
        end

        resources :comments, only: %i[create update destroy] do
          get 'by_ticket', on: :member
        end

        resources :dashboard, only: %i[] do
          collection do
            get 'data'
            get 'static'
          end
        end

        resources :logs, only: %i[] do
          collection do
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
        resources :users, only: %i[] do
          collection do
            get 'profile'
          end
        end
        resources :tickets, only: %i[create]
      end
    end

    resources :tickets, only: %i[new]

  end
end
