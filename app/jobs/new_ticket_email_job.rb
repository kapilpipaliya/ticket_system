class NewTicketEmailJob < ApplicationJob
  queue_as :default

  def perform(ticket)
    TicketMailer.with(ticket: ticket).new_ticket_email.deliver_later
  end
end
