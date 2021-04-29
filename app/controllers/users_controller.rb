class UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user!, only: %i[  ]

  def show
    render json: current_user.to_json
  end

end
