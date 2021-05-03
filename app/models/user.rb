class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :trackable
  has_many :tickets

  enum role: [:customer, :support]

  validates :role, inclusion: { in: roles.keys }
  validates :first_name, :role, presence: true
end
