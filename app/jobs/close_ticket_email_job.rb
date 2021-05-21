class CloseTicketEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket_id)
    TicketMailer.with(ticket_id: ticket_id).close_ticket.deliver_later
  end
end
