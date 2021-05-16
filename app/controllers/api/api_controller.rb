module Api
  class ApiController < ActionController::API
    include AuthHelper
    include Pundit
    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
    before_action :set_current_user

    private

    def set_current_user
      Current.current_user = current_user
    end
  end
end
