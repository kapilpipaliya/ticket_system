class UserPolicy < ApplicationPolicy
  def all?
    @user && (@user.support? || @user.customer?)
  end

  def show?
    true
  end
end
