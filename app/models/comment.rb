class Comment < ApplicationRecord
  belongs_to :ticket
  belongs_to :commenter, class_name: 'User'

  default_scope { order(created_at: :asc) }

  enum sentiment: %i[negative positive neutral]

  validates :description, :ticket, :commenter, presence: true
  # validates :sentiment, inclusion: { in: sentiments.keys }

  after_commit :update_ticket_last_activity, :update_sentiment

  private

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later self.ticket.id, Time.current
  end

  def update_sentiment
    CommentSentimentJob.perform_later self.id
  end
end
