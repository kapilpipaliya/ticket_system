class TicketMailer < ApplicationMailer
  default from: 'notifications@example.com'

  def new_ticket
    @ticket = Ticket.find(params[:ticket_id])
    @site_title = 'Mentor'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @ticket.id
    @help_topic = ''
    @email = @ticket.email
    @message = @ticket.description
    @ticket_url = "https://mentor.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def ticket_status_change
    @ticket = Ticket.find(params[:ticket_id])
    mail(to: @ticket.email, subject: 'Welcome to My Awesome Site')
  end

  def ticket_reply
    @ticket = Ticket.find(params[:ticket_id])
    mail(to: @ticket.email, subject: 'Welcome to My Awesome Site')
  end
end
