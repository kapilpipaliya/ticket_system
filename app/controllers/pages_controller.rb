class PagesController < ApplicationController
  before_action :authenticate_user!, only: %i[dashboard dashboard_data]
  before_action :authorize_actions

  def index; end

  def dashboard; end

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
    when 'index', 'dashboard', 'dashboard_static_data', 'dashboard_data', 'latest_activity'
      authorize :page
    else
      raise NotImplementedError
    end
  end
end
