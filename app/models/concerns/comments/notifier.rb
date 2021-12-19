# frozen_string_literal: true

module Comments
  module Notifier
    extend ActiveSupport::Concern
    included do
      after_commit :send_email, :update_ticket_last_activity, :update_sentiment
    end

    private

    def send_email
      return unless @send_notification

      TicketReplyJob.perform_later ticket_id: ticket.id, comment_id: id if ticket_owner_comment?
    end

    def ticket_owner_comment?
      commenter.email != ticket.email
    end

    def update_ticket_last_activity
      TicketLastActivityUpdateJob.perform_later ticket_id: ticket.id, time: Time.current
    end

    def update_sentiment
      CommentSentimentJob.perform_later comment_id: id
    end
  end
end
