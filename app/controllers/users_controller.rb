class UsersController < ApplicationController
  before_action :authenticate_user!, only: %i[]
  before_action :authorize_actions

  def all
    @users = policy_scope(User)
  end

  def show
    render json: current_user.to_json
  end

  private

  def authorize_actions
    case action_name
    when 'all', 'show'
      authorize User
    else
      raise NotImplementedError
    end
  end
end
