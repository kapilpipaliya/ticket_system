class DashboardStatic
  def data
    { overdue_count: overdue_count.count, due_today: due_today.count }
  end

  private

  def overdue_count
    Ticket.where('due_date < :today', { today: Date.today }).not_close_status
  end

  def due_today
    Ticket.where(due_date: Date.today).not_close_status
  end
end
