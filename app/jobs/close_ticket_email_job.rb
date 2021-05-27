class CloseTicketEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket_id:)
    TicketMailer.close_ticket(ticket_id: ticket_id).deliver_later
  end
end
