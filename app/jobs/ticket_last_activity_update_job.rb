class TicketLastActivityUpdateJob < ApplicationJob
  queue_as :default

  def perform(ticket, time)
    ticket.update_column(:last_activity, time)
  end
end
