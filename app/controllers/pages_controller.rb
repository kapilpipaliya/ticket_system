class PagesController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[dashboard dashboard_data]

  def index
    authorize :page
  end

  def dashboard
    authorize :page
  end

  def dashboard_data
    authorize :page
    @dashboard_data = Dashboard.new(params[:from], params[:to]).data
  end
end
