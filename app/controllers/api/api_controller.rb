module Api
  class ApiController < ActionController::API
    include AuthHelper
    include Pundit
    rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
    around_action :set_current_user
    respond_to :json

    private

    def set_current_user
      Current.current_user = current_user
      yield
    ensure
      Current.current_user = nil
    end
  end
end
