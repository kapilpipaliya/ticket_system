class TicketReplyJob < ApplicationJob
  queue_as :default

  def perform(ticket_id, comment_id)
    TicketMailer.with(ticket_id: ticket_id, comment_id: comment_id).ticket_reply.deliver_later
  end
end
