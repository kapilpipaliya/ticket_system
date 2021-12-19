# frozen_string_literal: true

class DashboardPolicy < ApplicationPolicy
  def static?
    @user.support?
  end

  alias data? static?
end
