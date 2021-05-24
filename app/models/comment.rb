class Comment < ApplicationRecord
  attr_accessor :send_notification

  after_initialize { |comment| @send_notification = true }

  belongs_to :ticket
  belongs_to :commenter, class_name: 'User', optional: true

  default_scope { order(created_at: :asc) }

  enum sentiment: %i[negative positive neutral], _suffix: true

  validates :description, :ticket, presence: true
  # validates :commenter, presence: true, on: :create, if: -> { supporter? || customer? }
  # validates :sentiment, inclusion: { in: sentiments.keys }

  after_commit :send_email, :update_ticket_last_activity, :update_sentiment

  private

  def send_email
    return unless @send_notification

    TicketReplyJob.perform_later ticket.id, id if commenter.email != ticket.email
    if previously_new_record?
      Log.create({ activity: "New comment(#{id}) on ticket(#{ticket.subject}) is created" })
    elsif destroyed?
      Log.create({ activity: "Comment(#{id}) on ticket(#{ticket.subject}) is deleted" })
    else
      Log.create({ activity: "Comment(#{id}) on ticket(#{ticket.subject}) is updated" })
    end
  end

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later ticket.id, Time.current
  end

  def update_sentiment
    CommentSentimentJob.perform_later id
  end
end
