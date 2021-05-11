class User < ApplicationRecord
  # Include default devise modules.
  # Others available are: :timeoutable, and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable, :confirmable, :lockable, :trackable
  has_many :tickets

  enum role: %i[customer support]
  after_initialize :set_default_role, if: :new_record?

  validates :role, inclusion: { in: roles.keys }
  validates :first_name, :role, presence: true

  def set_default_role
    self.role ||= :customer
  end
end
