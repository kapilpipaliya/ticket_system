class NewTicketEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket_id)
    TicketMailer.with(ticket_id: ticket_id).new_ticket.deliver_later
  end
end
