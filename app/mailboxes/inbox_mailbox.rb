# frozen_string_literal: true

class InboxMailbox < ApplicationMailbox
  TICKET_ID_MATCHER = /.*Case #([0-9]+)/i

  def process
    ticket_id_ = ticket_id
    email_text = ''

    if mail.multipart?
      part = mail.html_part || mail.text_part
      html = part.body.decoded
      doc = Nokogiri.HTML(html)

      # gmail is modifying id and removing className from email template
      doc.css('[id$="remove"]').remove
      email_text = doc.to_html
    else
      email_text = mail.decoded
    end

    if ticket_id_
      ticket = Ticket.find(ticket_id)
      if ticket
        comment = Comment.new({ ticket: ticket, description: email_text,
                                commenter: user_extracted_from_mail_address })
        comment.send_notification = false
        comment.save!
      end
    else
      created_at = Time.zone.now
      ticket =
        Ticket.new(
          { subject: mail.subject, description: email_text, email: mail.from.first,
            name: mail.from.first.split('@').first, created_at: created_at, due_date: created_at + 5.days }
        )
      ticket.save!(validate: false)
    end
  end

  private

  def ticket_id
    match = TICKET_ID_MATCHER.match(mail.subject)
    match &&= match[1]
    match
  end

  def user_extracted_from_mail_address
    User.find_by(email: mail.from.first)
  end
end
