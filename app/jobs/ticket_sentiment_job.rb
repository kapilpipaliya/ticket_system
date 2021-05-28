class TicketSentimentJob < ApplicationJob
  queue_as :sentiment_analysis_query

  def perform(ticket_id:)
    ticket = Ticket.find(ticket_id)
    analyzer = Sentimental.new(threshold: 0.1)
    analyzer.load_defaults
    analyze_string = ticket.subject + ActionController::Base.helpers.strip_tags(ticket.description)
    sentiment = analyzer.sentiment analyze_string
    ticket.update_columns(sentiment: Ticket.sentiments[sentiment],
                          sentiment_score: analyzer.score(analyze_string))
  end
end
