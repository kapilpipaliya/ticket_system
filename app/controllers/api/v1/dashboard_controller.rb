# frozen_string_literal: true

module Api
  module V1
    class DashboardController < Api::ApiController
      before_action :authenticate_user!, only: %i[dashboard_static_data dashboard_data]
      before_action :authorize_actions

      def static
        @dashboard_data = DashboardStatic.new(tickets: Ticket).data
      end

      def data
        @dashboard_data = Dashboard.new(tickets: Ticket, from: params[:from], to: params[:to]).data
      end

      private

      def authorize_actions
        case action_name
        when 'static', 'data'
          authorize :dashboard
        else
          raise NotImplementedError
        end
      end
    end
  end
end
