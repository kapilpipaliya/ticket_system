# frozen_string_literal: true

class CloseTicketEmailJob < ApplicationJob
  queue_as :mail_query

  def perform(ticket_id:)
    TicketMailer.close_ticket(ticket_id: ticket_id).deliver_later
  end
end
