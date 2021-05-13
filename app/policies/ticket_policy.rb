class TicketPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.customer?
        scope.tickets_from(current_user)
      elsif user.support?
        scope
      else
        scope.limit(0)
      end
    end
  end

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
