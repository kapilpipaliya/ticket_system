class DashboardPolicy < ApplicationPolicy
  def dashboard_static_data?
    @user.support?
  end

  def dashboard_data?
    @user.support?
  end

  def latest_activity?
    @user.support?
  end
end
