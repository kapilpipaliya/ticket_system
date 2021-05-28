class TicketLastActivityUpdateJob < ApplicationJob
  queue_as :audit_query

  def perform(ticket_id:, time:)
    Ticket.find(ticket_id).update_column(:last_activity, time)
  end
end
