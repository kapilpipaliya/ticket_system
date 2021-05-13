class ApplicationController < ActionController::Base
  include AuthHelper
  include Pundit
  protect_from_forgery with: :null_session
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_current_user

  protected

  def configure_permitted_parameters
    attributes = %i[first_name last_name]
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end

  def user_not_authorized
    render json: { 'base' => :unauthorized }, status: :unprocessable_entity
  end

  def set_current_user
    Current.current_user = current_user
  end
end
