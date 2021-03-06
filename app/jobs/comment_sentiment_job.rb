# frozen_string_literal: true

class CommentSentimentJob < ApplicationJob
  queue_as :sentiment_analysis_query
  before_perform :analyser

  def perform(comment_id:)
    comment = Comment.find(comment_id)
    sentiment = @analyzer.sentiment ActionController::Base.helpers.strip_tags(comment.description)
    comment.update_columns(sentiment: Comment.sentiments[sentiment],
                           sentiment_score: @analyzer.score(comment.description))
  end

  private

  def analyser
    @analyzer = Sentimental.new(threshold: 0.1)
    analyzer.load_defaults
  end
end
