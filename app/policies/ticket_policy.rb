class TicketPolicy < ApplicationPolicy
  def index?
    @user.support? || @user.customer?
  end

  def all_status?
    true
  end

  def all_status_filter?
    true
  end

  def new?
    true
  end

  def edit?
    @user.support? || @user.customer?
  end

  def show?
    @user.support? || @user.customer?
  end

  def create?
    true
  end

  def update?
    @user.support? || @user.customer?
  end

  def destroy?
    @user.support?
  end
end
