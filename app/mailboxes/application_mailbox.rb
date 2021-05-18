class ApplicationMailbox < ActionMailbox::Base
  # routing /something/i => :somewhere
  routing /@o-k.website\Z/i => :inbox
end
