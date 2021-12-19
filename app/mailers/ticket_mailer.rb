# frozen_string_literal: true

class TicketMailer < ApplicationMailer
  default from: 'admin@o-k.website'

  def new_ticket(ticket_id:)
    ticket_data ticket_id: ticket_id
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def ticket_status_change(ticket_id:)
    ticket_data ticket_id: ticket_id
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def ticket_reply(ticket_id:, comment_id:)
    ticket_data ticket_id: ticket_id
    @comment = Comment.find(comment_id)
    @tracking_id = @comment.id
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  def close_ticket(ticket_id:)
    ticket_data ticket_id: ticket_id
    mail(to: @ticket.email, subject: "Case ##{@ticket.id}")
  end

  private

  def ticket_data(ticket_id:)
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
  end
end
