# frozen_string_literal: true

class NewTicketEmailJob < ApplicationJob
  queue_as :mail_query

  def perform(ticket_id:)
    TicketMailer.new_ticket(ticket_id: ticket_id).deliver_later
  end
end
