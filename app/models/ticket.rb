class Ticket < ApplicationRecord
  include AuthHelper

  attr_accessor :send_notification

  after_initialize { |ticket| @send_notification = true }

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }

  enum status: %i[open hold close], _suffix: true
  enum sentiment: %i[negative positive neutral], _suffix: true

  validates :subject, presence: true, length: { minimum: 10 }
  validates :description, presence: true, length: { minimum: 10 }
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, inclusion: { in: statuses.keys }

  # validates :sentiment, inclusion: { in: sentiments.keys }
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, on: :create, if: -> { supporter? || customer? }

  before_create :set_due_date
  after_create_commit :new_ticket
  after_update_commit :update_ticket

  after_save_commit :update_ticket_last_activity, :update_sentiment
  after_destroy_commit :after_destroy_log

  private

  def set_due_date
    self.due_date ||= Time.zone.now + 5.days
  end

  def update_log
    if status != status_before_last_save && !close_status?
      Log.create({ activity: "Ticket (#{subject}) is created" })
    elsif assignee_id_before_last_save

    end
  end

  def new_ticket
    NewTicketEmailJob.perform_later id if @send_notification
    Log.create({ activity: "New Ticket (#{subject}) is created" })
  end

  def update_ticket
    if status != status_before_last_save && !close_status?
      TicketStatusChangeEmailJob.perform_later id
      Log.create({ activity: "Ticket (#{subject}) status changed to #{status}" })
    end
    if status != status_before_last_save && close_status?
      CloseTicketEmailJob.perform_later id
      Log.create({ activity: "Ticket (#{subject}) is closed" })
    end
    if assignee_id != assignee_id_before_last_save
      if !assignee_id_before_last_save
        Log.create({ activity: "Ticket (#{subject}) is assigned to #{assignee ? assignee.first_name : 'No Body'}" })
      else
        Log.create({ activity: "Ticket (#{subject}) is reassigned to #{assignee ? assignee.first_name : 'No Body'}" })
      end
    end
  end

  def update_ticket_last_activity
    TicketLastActivityUpdateJob.perform_later id, Time.current
  end

  def update_sentiment
    TicketSentimentJob.perform_later id
  end

  def after_destroy_log
    Log.create({ activity: "ticket (#{subject}) is deleted" })
  end
end
