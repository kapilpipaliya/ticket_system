class Ticket < ApplicationRecord
  # https://stackoverflow.com/questions/36911269/rails-custom-validation-involving-current-user
  attr_accessor :current_user

  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  scope :tickets_from, ->(user) { where(creator: user.id) }

  enum status: [:open, :close, :closed_forever]

  validates :status, inclusion: { in: statuses.keys }
  validates :subject, :description, presence: true, if: :guest?
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email, :name, presence: true, if: :guest?
  validates :creator, absence: true, if: :guest?
  validates :creator, presence: true, if: -> { supporter? || customer? }

  private

  def guest?
    current_user.nil?
  end

  def supporter?
    current_user&.role == "support"
  end

  def customer?
    current_user&.role == "support"
  end
end
