# frozen_string_literal: true

module Tickets
  module Notifier
    extend ActiveSupport::Concern
    included do
      after_create_commit :new_ticket_email
      after_update_commit :update_ticket_email
      after_save_commit :update_ticket_last_activity, :update_sentiment
    end

    private

    def new_ticket_email
      NewTicketEmailJob.perform_later id: id if @send_notification
    end

    def update_ticket_email
      if status_changed? && !close_status?
        TicketStatusChangeEmailJob.perform_later ticket_id: id
      elsif status_changed? && close_status?
        CloseTicketEmailJob.perform_later ticket_id: id
      end
    end

    def update_ticket_last_activity
      TicketLastActivityUpdateJob.perform_later ticket_id: id, time: Time.current
    end

    def update_sentiment
      TicketSentimentJob.perform_later ticket_id: id
    end
  end
end
