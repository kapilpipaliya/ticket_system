# frozen_string_literal: true

class TicketReplyJob < ApplicationJob
  queue_as :mail_query

  def perform(ticket_id:, comment_id:)
    TicketMailer.ticket_reply(ticket_id: ticket_id, comment_id: comment_id).deliver_later
  end
end
