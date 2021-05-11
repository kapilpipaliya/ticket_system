class PagesController < ApplicationController
  def index; end

  def dashboard; end

  def dashboard_data
    @from = params[:from] ? Time.zone.at(params[:from].to_i) : Time.zone.now.midnight
    @to = params[:to] ? Time.zone.at(params[:to].to_i) : Time.zone.now.midnight + 1.day
    new_tickets_count = new_tickets.count
    tickets_per_day = new_tickets_count / ((@to - @from).to_i / 60 / 60 / 24)
    @dashboard_data = {
      overdue_count: overdue_count.count,
      due_today: due_today.count,
      latest_activity: latest_activity,
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

  def overdue_count
    Ticket.where('due_date < :today', { today: Date.today }).not_close
  end

  def due_today
    Ticket.where(due_date: Date.today).not_close
  end

  def unresolved_count
    # open + hold
    apply_date_rage(Ticket).where('status = :open or status = :hold', { open: Ticket.statuses[:open], hold: Ticket.statuses[:hold] })
  end

  def open
    apply_date_rage(Ticket).open
  end

  def hold
    apply_date_rage(Ticket).hold
  end

  def close
    apply_date_rage(Ticket).close
  end

  def assigned
    apply_date_rage(Ticket).where('assignee_id is not null')
  end

  def replies
    apply_date_rage(Comment)
  end

  def latest_activity
    apply_date_rage(Ticket).order(created_at: :desc).limit(5)
  end

  def new_tickets
    apply_date_rage(Ticket)
  end

  def apply_date_rage(model)
    model.where(created_at: @from..@to)
  end
end
