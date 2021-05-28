# frozen_string_literal: true

class ApplicationMailbox < ActionMailbox::Base
  # routing /something/i => :somewhere
  routing all: :inbox
end
