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

  alias create? by_ticket?

  alias update? index?

  alias destroy? index?
end
