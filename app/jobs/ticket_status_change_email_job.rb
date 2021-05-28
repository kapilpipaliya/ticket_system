class TicketStatusChangeEmailJob < ApplicationJob
  queue_as :mail_query

  def perform(ticket_id:)
    TicketMailer.ticket_status_change(ticket_id: ticket_id).deliver_later
  end
end
