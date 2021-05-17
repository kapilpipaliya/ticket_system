class Comment < ApplicationRecord
  belongs_to :ticket
  belongs_to :commenter, class_name: 'User'

  default_scope { order(created_at: :asc) }

  validates :description, :ticket, :commenter, presence: true

  after_create_commit :update_ticket_comments_count_create
  after_destroy_commit :update_ticket_comments_count_update

  after_commit :update_ticket_last_activity

  private

  def update_ticket_comments_count
    TicketCommentsCountUpdateJob.perform_later self.ticket.id
  end

  alias update_ticket_comments_count_create update_ticket_comments_count
  alias update_ticket_comments_count_update update_ticket_comments_count

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later self.ticket.id, Time.current
  end
end
