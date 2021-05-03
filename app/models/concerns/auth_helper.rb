module AuthHelper
  extend ActiveSupport::Concern

  private

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