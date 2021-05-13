class UsersController < ApplicationController
  before_action :authenticate_user!, only: %i[]
  before_action :authorize_actions

  def all
    @users =
      if !current_user
        []
      else
        if current_user.customer?
          User.where(id: current_user.id)
        elsif current_user.support?
          User.where(role: 'support').order(created_at: :asc)
        else
          []
        end
      end
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
