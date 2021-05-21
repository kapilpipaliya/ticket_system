class TicketMailer < ApplicationMailer
  default from: 'admin@o-k.website'

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
    @site_title = 'Mentor'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @ticket.id
    @help_topic = ''
    @email = @ticket.email
    @message = @ticket.description
    @status = @ticket.status
    @ticket_url = "https://mentor.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def ticket_reply
    @ticket = Ticket.find(params[:ticket_id])
    @comment = Comment.find(params[:comment_id])
    @site_title = 'Mentor'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @comment.id
    @help_topic = ''
    @email = @ticket.email
    @message = @comment.description
    @ticket_url = "https://mentor.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def close_ticket
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
end
