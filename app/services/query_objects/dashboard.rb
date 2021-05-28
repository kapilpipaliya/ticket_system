class Dashboard
  def initialize(tickets:, from:, to:)
    @tickets = tickets
    @from = from ? Time.zone.at(from.to_i) : Time.zone.now.midnight
    @to = to ? Time.zone.at(to.to_i) : Time.zone.now.midnight + 1.day
  end

  def data
    new_tickets_count = @tickets.apply_date_rage(@from, @to).count
    tickets_per_day = new_tickets_count / ((@to - @from).to_i / 60 / 60 / 24)
    {
      open: @tickets.apply_date_rage(@from, @to).open_status.count,
      hold: @tickets.apply_date_rage(@from, @to).hold_status.count,
      close: @tickets.apply_date_rage(@from, @to).close_status.count,
      assigned: @tickets.apply_date_rage(@from, @to).assigned.count,
      unresolved_count: @tickets.apply_date_rage(@from, @to).unresolved.count,
      replies: Comment.where(ticket: Ticket.all).apply_date_rage(@from, @to).count,
      new_tickets: new_tickets_count,
      tickets_per_day: tickets_per_day,
    }
  end
end
