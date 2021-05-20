class Dashboard
  def initialize(from, to)
    @from = from ? Time.zone.at(from.to_i) : Time.zone.now.midnight
    @to = to ? Time.zone.at(to.to_i) : Time.zone.now.midnight + 1.day
  end

  def data
    new_tickets_count = new_tickets.count
    tickets_per_day = new_tickets_count / ((@to - @from).to_i / 60 / 60 / 24)
    {
      open: open.count,
      hold: hold.count,
      close: close.count,
      assigned: assigned.count,
      unresolved_count: unresolved_count.count,
      replies: replies.count,
      new_tickets: new_tickets_count,
      tickets_per_day: tickets_per_day,
    }
  end

  private

  def unresolved_count
    # open + hold
    apply_date_rage(Ticket).where('status = :open or status = :hold', { open: Ticket.statuses[:open], hold: Ticket.statuses[:hold] })
  end

  def open
    apply_date_rage(Ticket).open_status
  end

  def hold
    apply_date_rage(Ticket).hold_status
  end

  def close
    apply_date_rage(Ticket).close_status
  end

  def assigned
    apply_date_rage(Ticket).where('assignee_id is not null')
  end

  def replies
    apply_date_rage(Comment)
  end

  def new_tickets
    apply_date_rage(Ticket)
  end

  def apply_date_rage(model)
    model.where(created_at: @from..@to)
  end
end
