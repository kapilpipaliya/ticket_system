class UserPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.customer?
        scope.where(id: user.id)
      elsif user.support?
        scope.where(role: 'support').order(created_at: :asc)
      else
        scope.limit(0)
      end
    end
  end

  def all?
    @user && (@user.support? || @user.customer?)
  end

  def profile?
    true
  end
end
