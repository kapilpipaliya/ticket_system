class NewTicketEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket_id:)
    TicketMailer.new_ticket(ticket_id: ticket_id).deliver_later
  end
end
