# frozen_string_literal: true

class LogPolicy < ApplicationPolicy
  def latest_activity?
    @user.support?
  end
end
