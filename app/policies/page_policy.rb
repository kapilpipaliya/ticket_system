class PagePolicy < ApplicationPolicy
  def index?
    true
  end

  def dashboard?
    @user.support?
  end
  def dashboard_static_data?
    @user.support?
  end
  def dashboard_data?
    @user.support?
  end
end
