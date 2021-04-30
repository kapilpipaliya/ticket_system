class Ticket < ApplicationRecord
  belongs_to :created_by, class_name: 'User', optional: true
  belongs_to :assigned_to, class_name: 'User', optional: true
  has_many :comments, dependent: :destroy

  validates :subject, presence: true
  validates :name_of_submitter, presence: true
  validates :email_of_submitter, presence: true
end
