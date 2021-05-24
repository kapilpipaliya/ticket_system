class DashboardPolicy < ApplicationPolicy
  def static?
    @user.support?
  end

  alias data? static?
end
