class TicketCommentsCountUpdateJob < ApplicationJob
  queue_as :default

  def perform(ticket_id)
    ticket = Ticket.find(ticket_id)
    ticket.update_column(:comments_count, ticket.comments.count)
  end
end
