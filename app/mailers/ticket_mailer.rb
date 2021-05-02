class TicketMailer < ApplicationMailer
  default from: 'notifications@example.com'

  def new_ticket_email
    @ticket = params[:ticket]
    @url = 'http://example.com/login'
    mail(to: @ticket.email_of_submitter, subject: 'Welcome to My Awesome Site')
  end

  def ticket_status_change_email
    @ticket = params[:ticket]
    @url = 'http://example.com/login'
    mail(to: @ticket.email_of_submitter, subject: 'Welcome to My Awesome Site')
  end
end
