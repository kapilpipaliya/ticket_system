class CommentPolicy < ApplicationPolicy
  def index?
    @user.support?
  end

  def by_ticket?
      @user.support? || @user.customer?
  end

  def show?
    false
  end

  def create?
    @user.support? || @user.customer?
  end

  def update?
    @user.support?
  end

  def destroy?
    @user.support?
  end


end