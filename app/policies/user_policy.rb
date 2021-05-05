class UserPolicy < ApplicationPolicy
  def all?
    @user.support? || @user.customer?
  end

  def show?
    true
  end
end