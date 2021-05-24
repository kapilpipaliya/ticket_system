class LatestActivity
  def initialize(from, to, limit)
    @from = from ? Time.zone.at(from.to_i) : Time.zone.now.midnight
    @to = to ? Time.zone.at(to.to_i) : Time.zone.now.midnight + 1.day
    @limit = limit
  end

  def data
    { latest_activity: latest_activity }
  end

  private

  def latest_activity
    apply_date_rage(Log).order(created_at: :desc).limit(@limit)
  end

  def apply_date_rage(model)
    model.where(created_at: @from..@to)
  end
end
