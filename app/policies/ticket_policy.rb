# frozen_string_literal: true

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

  alias all_status_filter? all_status?
  alias new? all_status?
  alias create? all_status?
  alias sentiments_options_filter? all_status?

  alias edit? index?
  alias show? index?
  alias update? index?

  def destroy?
    @user.support?
  end
end
