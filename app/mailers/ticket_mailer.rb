class TicketMailer < ApplicationMailer
  default from: 'admin@o-k.website'

  def new_ticket(ticket_id:)
    @ticket = Ticket.find(ticket_id)
    @site_title = 'Ticket System'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @ticket.id
    @help_topic = ''
    @email = @ticket.email
    @message = @ticket.description
    @ticket_url = "https://example.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    @website = 'www.google.com'
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def ticket_status_change(ticket_id:)
    @ticket = Ticket.find(ticket_id)
    @site_title = 'Ticket System'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @ticket.id
    @help_topic = ''
    @email = @ticket.email
    @message = @ticket.description
    @status = @ticket.status
    @ticket_url = "https://example.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    @website = 'www.google.com'
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def ticket_reply(ticket_id:, comment_id:)
    @ticket = Ticket.find(ticket_id)
    @comment = Comment.find(comment_id)
    @site_title = 'Ticket System'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @comment.id
    @help_topic = ''
    @email = @ticket.email
    @message = @comment.description
    @ticket_url = "https://example.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    @website = 'www.google.com'
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def close_ticket(ticket_id:)
    @ticket = Ticket.find(ticket_id)
    @site_title = 'Ticket System'
    @username = ''
    @subject = @ticket.subject
    @tracking_id = @ticket.id
    @help_topic = ''
    @email = @ticket.email
    @message = @ticket.description
    @ticket_url = "https://example.com//tickets/#{@ticket.id}/edit"
    @department = ''
    @priority = ''
    @current_year = 2021
    @website = 'www.google.com'
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end
end
