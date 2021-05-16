class PagePolicy < ApplicationPolicy
  def index?
    true
  end

  def dashboard?
    @user.support?
  end
end
