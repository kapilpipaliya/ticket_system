class User < ApplicationRecord
  # Include default devise modules.
  # Others available are: :timeoutable, and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable, :lockable, :trackable
  has_many :tickets

  enum role: %i[customer support]
  before_create :set_default_role, if: :new_record?

  validates :first_name, presence: true
  validates :role, presence: true, inclusion: { in: roles.keys }

  def set_default_role
    self.role ||= :customer
  end
end
