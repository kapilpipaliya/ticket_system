# frozen_string_literal: true

module Comments
  module ActivityLogObserver
    extend ActiveSupport::Concern
    included do
      after_commit :save_log
    end

    private

    def save_log
      if previously_new_record?
        Log.create({ activity: "New comment(#{id}) on ticket(#{ticket.subject}) is created" })
      elsif destroyed?
        Log.create({ activity: "Comment(#{id}) on ticket(#{ticket.subject}) is deleted" })
      else
        Log.create({ activity: "Comment(#{id}) on ticket(#{ticket.subject}) is updated" })
      end
    end
  end
end
