class Ticket < ApplicationRecord
  include AuthHelper
  attr_accessor :send_notification, :boolean
  def send_notification
    @send_notification.nil? ? true : @send_notification
  end

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }
  scope :apply_date_rage, ->(from, to) { where(created_at: from..to) }
  scope :unresolved, -> { where('status = :open or status = :hold', { open: Ticket.statuses[:open], hold: Ticket.statuses[:hold] }) }
  scope :overdue, -> { where('due_date < :today', { today: Time.zone.today }).not_close_status }
  scope :due_today, -> { where(due_date: Time.zone.today).not_close_status }
  scope :assigned, -> { where.not(assignee_id: nil) }

  enum status: %i[open hold close], _suffix: true
  enum sentiment: %i[negative positive neutral], _suffix: true
  attribute :sentiment, :integer, default: sentiments[:negative]
  attribute :due_date, :datetime, default: Time.zone.now + 5.days

  validates :subject, presence: true, length: { minimum: 10 }
  validates :description, presence: true, length: { minimum: 10 }
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, inclusion: { in: statuses.keys }

  # validates :sentiment, inclusion: { in: sentiments.keys }
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, on: :create, if: -> { supporter? || customer? }

  after_create_commit :new_ticket
  after_update_commit :update_ticket

  after_save_commit :update_ticket_last_activity, :update_sentiment
  after_destroy_commit :after_destroy_log

  private

  def new_ticket
    NewTicketEmailJob.perform_later id: id if @send_notification
    Log.create({ activity: "New Ticket (#{subject}) is created" })
  end

  def update_ticket
    if status_changed? && !close_status?
      TicketStatusChangeEmailJob.perform_later ticket_id: id
      Log.create({ activity: "Ticket (#{subject}) status changed to #{status}" })
    elsif status_changed? && close_status?
      CloseTicketEmailJob.perform_later ticket_id: id
      Log.create({ activity: "Ticket (#{subject}) is closed" })
    elsif assignee_id_changed?
      if !assignee_id_before_last_save
        Log.create({ activity: "Ticket (#{subject}) is assigned to #{assignee ? assignee.first_name : 'No Body'}" })
      else
        Log.create({ activity: "Ticket (#{subject}) is reassigned to #{assignee ? assignee.first_name : 'No Body'}" })
      end
    end
  end

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later ticket_id: id, time: Time.current
  end

  def update_sentiment
    TicketSentimentJob.perform_later ticket_id: id
  end

  def after_destroy_log
    Log.create({ activity: "ticket (#{subject}) is deleted" })
  end
end
