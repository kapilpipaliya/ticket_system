class TicketCommentCount
  def initialize
    @assignee_comments_count = build_ticket_with_comments
  end

  def tickets
    TicketCommentDelegator.new(@assignee_comments_count)
  end

  private

  def build_ticket_with_comments
    Ticket.select("tickets.*, count(c.*) as assignee_comments").
      from(Arel.sql("tickets")).
      joins!(Arel.sql("left join comments c on tickets.id = c.ticket_id and tickets.assignee_id = c.commenter_id")).
      group!(Arel.sql("tickets.id"))
  end

end