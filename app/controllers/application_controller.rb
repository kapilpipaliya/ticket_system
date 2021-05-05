class ApplicationController < ActionController::Base
  include AuthHelper
  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  # after_action :verify_authorized, except: :index
  # after_action :verify_policy_scoped, only: :index

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    attributes = %i[first_name last_name]
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end

  def user_not_authorized
    render json: {'base'=>:unauthorized}, status: :unprocessable_entity
  end
end
