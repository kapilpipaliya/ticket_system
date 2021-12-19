# frozen_string_literal: true

class Ticket < ApplicationRecord
  include AuthHelper
  include Tickets::Notifier
  include Tickets::ActivityLogObserver
  attr_accessor :send_notification, :boolean

  def send_notification
    @send_notification.nil? ? true : @send_notification
  end

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }
  scope :apply_date_rage, ->(from, to) { where(created_at: from..to) }
  scope :unresolved, lambda {
                       where('status = :open or status = :hold', { open: Ticket.statuses[:open], hold: Ticket.statuses[:hold] })
                     }
  scope :overdue, -> { where('due_date < :today', { today: Time.zone.today }).not_close_status }
  scope :due_today, -> { where(due_date: Time.zone.today).not_close_status }
  scope :assigned, -> { where.not(assignee_id: nil) }

  enum status: { open: 0, hold: 1, close: 2 }, _suffix: true
  enum sentiment: { negative: 0, positive: 1, neutral: 2 }, _suffix: true
  attribute :sentiment, :integer, default: sentiments[:negative]
  attribute :sentiment_score, :integer, default: 0
  attribute :due_date, :datetime, default: Time.zone.now + 5.days

  validates :subject, presence: true, length: { minimum: 10 }
  validates :description, presence: true, length: { minimum: 10 }
  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :status, inclusion: { in: statuses.keys }

  # validates :sentiment, inclusion: { in: sentiments.keys }
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, on: :create, if: -> { supporter? || customer? }
end
