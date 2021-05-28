class User < ApplicationRecord
  # Include default devise modules.
  # Others available are: :timeoutable, and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :trackable
  has_many :tickets

  enum role: { customer: 0, support: 1 }
  attribute :role, :integer, default: roles[:customer]

  validates :first_name, presence: true
  validates :role, presence: true, inclusion: { in: roles.keys }
end
