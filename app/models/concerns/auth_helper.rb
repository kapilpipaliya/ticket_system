module AuthHelper
  extend ActiveSupport::Concern

  private

  def guest?
    current_user.nil?
  end

  def supporter?
    current_user&.support?
  end

  def customer?
    current_user&.customer?
  end
end