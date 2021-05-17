class DashboardPolicy < ApplicationPolicy
  def static?
    @user.support?
  end

  def data?
    @user.support?
  end

  def latest_activity?
    @user.support?
  end
end
