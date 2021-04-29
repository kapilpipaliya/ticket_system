class Ticket < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments

  validates :subject, presence: true
  validates :name_of_submitter, presence: true
  validates :email_of_submitter, presence: true
end
