class DashboardPolicy < ApplicationPolicy
  def static?
    @user.support?
  end

  alias data? static?

  alias latest_activity? static?
end
