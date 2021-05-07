class TicketCommentsCountUpdateJob < ApplicationJob
  queue_as :default

  def perform(ticket)
    ticket.update_column(:comments_count, ticket.comments.count)
  end
end
