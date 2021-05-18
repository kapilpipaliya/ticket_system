module Api
  module V1
    class UsersController < Api::ApiController
      before_action :authenticate_user!, only: %i[idnex]
      before_action :authorize_actions

      def index
        @users = policy_scope(User)
      end

      def profile
        render json: current_user.to_json
      end

      private

      def authorize_actions
        case action_name
        when 'index', 'profile'
          authorize User
        else
          raise NotImplementedError
        end
      end
    end
  end
end
