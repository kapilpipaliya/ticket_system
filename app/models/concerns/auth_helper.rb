module AuthHelper
  extend ActiveSupport::Concern

  private

  def guest?
    Current.current_user.nil?
  end

  def supporter?
    Current.current_user&.support?
  end

  def customer?
    Current.current_user&.customer?
  end
end
