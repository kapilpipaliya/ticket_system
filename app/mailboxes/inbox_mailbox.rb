class InboxMailbox < ApplicationMailbox
  before_processing :find_user

  def process
    ticket_id_ = ticket_id
    if ticket_id_
      ticket = Ticket.find(ticket_id)
      ticket.comments.create!(commenter: @user, description: mail.decoded) if @user if ticket
    else
      created_at = Time.zone.now
      ticket =
        Ticket.new(
          {
            subject: mail.subject,
            description: mail.decoded,
            email: mail.from.first,
            name: mail.from.first.split('@').first,
            created_at: created_at,
            due_date: created_at + 5.days
          }
        )
      ticket.save!(validate: false)
    end
  end

  private

  def ticket_id
    match = /ticket-([0-9])+/i.match(mail.subject)
    match &&= match[1]
    match
  end

  def find_user
    @user = User.find_by(email: mail.from.first)
  end
end
