class Ticket < ApplicationRecord
  belongs_to :creator, class_name: 'User', optional: true
  belongs_to :assignee, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  enum status: [:open, :close, :closed_forever]

  validates :status, inclusion: { in: statuses.keys }
  validates :subject, presence: true
  validates :name, presence: true
  validates :email, presence: true
end
