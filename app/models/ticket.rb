class Ticket < ApplicationRecord
  include AuthHelper

  # https://stackoverflow.com/questions/36911269/rails-custom-validation-involving-current-user
  attr_accessor :current_user

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }

  enum status: [:open, :close, :closed_forever]

  validates :status, inclusion: { in: statuses.keys }
  validates :subject, :description, presence: true, if: :guest?
  validates :subject, :description, length: { minimum: 10 }, if: :guest?
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, if: :guest?
  validates :email, :name, presence: true, if: :guest?
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, on: :create, if: -> { supporter? || customer? }

  after_create :send_new_ticket_email
  after_update :send_status_change_email

  private

  def send_new_ticket_email
    TicketMailer.with(ticket: self).new_ticket_email.deliver_later
  end

  def send_status_change_email
    send_status_change_email = self.status != self.status_before_last_save
    TicketMailer.with(ticket: self).ticket_status_change_email.deliver_later if send_status_change_email
  end
end
