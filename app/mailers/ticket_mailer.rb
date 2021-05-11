class TicketMailer < ApplicationMailer
  default from: 'notifications@example.com'

  def new_ticket_email
    @ticket = Ticket.find(params[:ticket_id])
    @url = 'http://example.com/login'
    mail(to: @ticket.email, subject: 'Welcome to My Awesome Site')
  end

  def ticket_status_change_email
    @ticket = Ticket.find(params[:ticket_id])
    @url = 'http://example.com/login'
    mail(to: @ticket.email, subject: 'Welcome to My Awesome Site')
  end
end
