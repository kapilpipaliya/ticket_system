class UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[  ]

  def all
    if !current_user
      @users = []
    else
      if current_user.role == "customer"
        @users = User.where(id: current_user.id)
      elsif current_user.role === "support"
        @users = User.where(role: 'support').order(created_at: :asc)
      else
        @users = []
      end
    end
  end

  def show
    render json: current_user.to_json
  end

end
