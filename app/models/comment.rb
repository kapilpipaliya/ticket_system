class Comment < ApplicationRecord
  attr_accessor :send_notification, :boolean

  def send_notification
    @send_notification.nil? ? true : @send_notification
  end

  belongs_to :ticket
  belongs_to :commenter, class_name: 'User', optional: true

  default_scope { order(created_at: :asc) }
  scope :apply_date_rage, ->(from, to) { where(created_at: from..to) }

  enum sentiment: { negative: 0, positive: 1, neutral: 2 }, _suffix: true
  attribute :sentiment, :integer, default: sentiments[:negative]

  validates :description, :ticket, presence: true

  # validates :commenter, presence: true, on: :create, if: -> { supporter? || customer? }
  # validates :sentiment, inclusion: { in: sentiments.keys }

  after_commit :send_email, :update_ticket_last_activity, :update_sentiment

  private

  def send_email
    return unless @send_notification

    TicketReplyJob.perform_later ticket_id: ticket.id, comment_id: id if ticket_owner_comment?
    if previously_new_record?
      Log.create({ activity: "New comment(#{id}) on ticket(#{ticket.subject}) is created" })
    elsif destroyed?
      Log.create({ activity: "Comment(#{id}) on ticket(#{ticket.subject}) is deleted" })
    else
      Log.create({ activity: "Comment(#{id}) on ticket(#{ticket.subject}) is updated" })
    end
  end

  def ticket_owner_comment?
    commenter.email != ticket.email
  end

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later ticket_id: ticket.id, time: Time.current
  end

  def update_sentiment
    CommentSentimentJob.perform_later comment_id: id
  end
end
