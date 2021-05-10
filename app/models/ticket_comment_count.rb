class TicketCommentCount
  def initialize(tickets)
    @tickets = tickets
  end

  def tickets
    build_ticket_with_comments
  end

  private

  def build_ticket_with_comments
    @tickets.select("tickets.*, count(c.*) as assignee_comments").
      from(Arel.sql("tickets")).
      joins!(Arel.sql("left join comments c on tickets.id = c.ticket_id and tickets.assignee_id = c.commenter_id")).
      group!(Arel.sql("tickets.id"))
  end

end