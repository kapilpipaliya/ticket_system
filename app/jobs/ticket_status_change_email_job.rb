class TicketStatusChangeEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket_id)
    TicketMailer.with(ticket_id: ticket_id).ticket_status_change_email.deliver_later
  end
end
