class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    attributes = %i[first_name last_name]
    devise_parameter_sanitizer.permit(:sign_up, keys: attributes)
    devise_parameter_sanitizer.permit(:account_update, keys: attributes)
  end

  def guest?
    current_user.nil?
  end

  def supporter?
    current_user&.role == "support"
  end

  def customer?
    current_user&.role == "customer"
  end
end
