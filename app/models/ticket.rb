class Ticket < ApplicationRecord
  VALID_STATUSES = %w[open close closed_forever].freeze
  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  validates :status, inclusion: { in: VALID_STATUSES }
  validates :subject, presence: true
  validates :name, presence: true
  validates :email, presence: true
end
