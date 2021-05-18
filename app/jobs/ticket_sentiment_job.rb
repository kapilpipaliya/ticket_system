class TicketSentimentJob < ApplicationJob
    queue_as :default
  
    def perform(ticket_id)
        ticket = Ticket.find(ticket_id)
        analyzer = Sentimental.new(threshold: 0.1)
        analyzer.load_defaults
        sentiment = analyzer.sentiment ActionController::Base.helpers.strip_tags(ticket.description)
        ticket.update_column(:sentiment, Ticket.sentiments[sentiment])
    end
  end
  