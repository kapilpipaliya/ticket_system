class TicketStatusChangeEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket)
    TicketMailer.with(ticket: ticket).ticket_status_change_email.deliver_later
  end
end
