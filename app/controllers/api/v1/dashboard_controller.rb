module Api
  module V1
    class DashboardController < Api::ApiController
      before_action :authenticate_user!, only: %i[dashboard_static_data dashboard_data latest_activity]
      before_action :authorize_actions
      def dashboard_static_data
        @dashboard_data = DashboardStatic.new.data
      end

      def dashboard_data
        @dashboard_data = Dashboard.new(params[:from], params[:to]).data
      end

      def latest_activity
        @dashboard_data = LatestActivity.new(params[:from], params[:to], params[:limit]).data
      end

      private

      def authorize_actions
        case action_name
        when 'dashboard_static_data', 'dashboard_data', 'latest_activity'
          authorize :dashboard
        else
          raise NotImplementedError
        end
      end
    end
  end
end
