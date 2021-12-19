# frozen_string_literal: true

class Comment < ApplicationRecord
  include Comments::Notifier
  include Comments::ActivityLogObserver
  attr_accessor :send_notification, :boolean

  def send_notification
    @send_notification.nil? ? true : @send_notification
  end

  belongs_to :ticket
  belongs_to :commenter, class_name: 'User', optional: true

  default_scope { order(created_at: :asc) }
  scope :apply_date_rage, ->(from, to) { where(created_at: from..to) }

  enum sentiment: { negative: 0, positive: 1, neutral: 2 }, _suffix: true
  attribute :sentiment, :integer, default: sentiments[:negative]
  attribute :sentiment_score, :integer, default: 0

  validates :description, :ticket, presence: true

  # validates :commenter, presence: true, on: :create, if: -> { supporter? || customer? }
  # validates :sentiment, inclusion: { in: sentiments.keys }
end
