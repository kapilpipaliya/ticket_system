# frozen_string_literal: true

# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

# fix signup form style
# https://coderwall.com/p/s-zwrg/remove-rails-field_with_errors-wrapper
ActionView::Base.field_error_proc = proc do |html_tag, _instance|
  html_tag.html_safe
end
