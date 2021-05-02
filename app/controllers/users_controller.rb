class UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[]

  def all
    @users = if !current_user
               []
             else
               if current_user.role == 'customer'
                 User.where(id: current_user.id)
               elsif current_user.role === 'support'
                 User.where(role: 'support').order(created_at: :asc)
               else
                 []
               end
             end
  end

  def show
    render json: current_user.to_json
  end
end
