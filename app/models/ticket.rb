class Ticket < ApplicationRecord
  include AuthHelper

  attr_accessor :send_notification

  after_initialize do |ticket|
    @send_notification = true
  end

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }

  enum status: [:open, :close, :closed_forever]

  validates :status, inclusion: { in: statuses.keys }
  validates :subject, :description, presence: true
  validates :subject, :description, length: { minimum: 10 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email, :name, presence: true
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, on: :create, if: -> { supporter? || customer? }

  after_create_commit :send_new_ticket_email
  after_update_commit :send_status_change_email

  after_save_commit :update_ticket_last_activity

  private

  def send_new_ticket_email
    NewTicketEmailJob.perform_later self if @send_notification
  end

  def send_status_change_email
    send_status_change_email = self.status != self.status_before_last_save
    TicketStatusChangeEmailJob.perform_later self if send_status_change_email
  end

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later self, Time.now
  end
end
