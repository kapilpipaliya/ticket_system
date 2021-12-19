# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.customer?
        scope.where(id: user.id)
      elsif user.support?
        scope.support.order(created_at: :asc)
      else
        scope.limit(0)
      end
    end
  end

  def index?
    @user && (@user.support? || @user.customer?)
  end

  def profile?
    true
  end
end
