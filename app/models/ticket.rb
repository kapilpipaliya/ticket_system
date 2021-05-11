class Ticket < ApplicationRecord
  include AuthHelper

  attr_accessor :send_notification

  after_initialize { |ticket| @send_notification = true }

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }

  enum status: %i[open hold close]

  validates :status, inclusion: { in: statuses.keys }
  validates :email, :name, :subject, :description, presence: true
  validates :subject, :description, length: { minimum: 10 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, on: :create, if: -> { supporter? || customer? }
  before_create :set_due_date
  after_create_commit :send_new_ticket_email
  after_update_commit :send_status_change_email

  after_save_commit :update_ticket_last_activity

  private

  def set_due_date
    self.due_date ||= Time.zone.now + 5.days
  end

  def send_new_ticket_email
    NewTicketEmailJob.perform_later self if @send_notification
  end

  def send_status_change_email
    send_status_change_email = self.status != self.status_before_last_save
    TicketStatusChangeEmailJob.perform_later self if send_status_change_email
  end

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later self, Time.current
  end
end
