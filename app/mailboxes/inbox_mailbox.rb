class InboxMailbox < ApplicationMailbox
  before_processing :find_user

  def process
    ticket_id_ = ticket_id
    email_text = ''
    if mail.multipart?
      email_text = mail.parts[0].body.decoded
    else
      email_html = mail.decoded
    end

    if ticket_id_
      ticket = Ticket.find(ticket_id)
      if ticket
        comment = Comment.new({
                                ticket: ticket,
                                description: email_text,
                                commenter: @user
                              })
        comment.send_notification = false
        comment.save!
      end
    else
      created_at = Time.zone.now
      ticket =
        Ticket.new(
          { subject: mail.subject, description: email_text, email: mail.from.first, name: mail.from.first.split('@').first, created_at: created_at, due_date: created_at + 5.days },
        )
      ticket.save!(validate: false)
    end
  end

  private

  def ticket_id
    match = /.*Case #([0-9]+)/i.match(mail.subject)
    match &&= match[1]
    match
  end

  def find_user
    @user = User.find_by(email: mail.from.first)
  end
end
