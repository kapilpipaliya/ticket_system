class DashboardStatic
  def initialize(tickets:)
    @tickets = tickets
  end

  def data
    { overdue_count: @tickets.overdue.count, due_today: @tickets.due_today.count }
  end
end
