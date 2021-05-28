module Api
  module V1
    class LogsController < Api::ApiController
      before_action :authenticate_user!, only: %i[latest_activity]
      before_action :authorize_actions

      def latest_activity
        @dashboard_data = LatestActivity.new(from: params[:from], to: params[:to],
                                             limit: params[:limit]).data
      end

      private

      def authorize_actions
        case action_name
        when 'latest_activity'
          authorize Log
        else
          raise NotImplementedError
        end
      end
    end
  end
end
