# frozen_string_literal: true

module Tickets
  module ActivityLogObserver
    extend ActiveSupport::Concern
    included do
      after_create_commit :new_ticket_log
      after_update_commit :update_ticket_log
      after_destroy_commit :after_destroy_log
    end

    private

    def new_ticket_log
      Log.create({ activity: "New Ticket (#{subject}) is created" })
    end

    def update_ticket_log
      if status_changed? && !close_status?
        Log.create({ activity: "Ticket (#{subject}) status changed to #{status}" })
      elsif status_changed? && close_status?
        Log.create({ activity: "Ticket (#{subject}) is closed" })
      elsif assignee_id_changed?
        if !assignee_id_before_last_save
          Log.create({ activity: "Ticket (#{subject}) is assigned to #{assignee ? assignee.first_name : 'No Body'}" })
        else
          Log.create({ activity: "Ticket (#{subject}) is reassigned to #{assignee ? assignee.first_name : 'No Body'}" })
        end
      end
    end

    def after_destroy_log
      Log.create({ activity: "ticket (#{subject}) is deleted" })
    end
  end
end
