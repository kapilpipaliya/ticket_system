class CommentSentimentJob < ApplicationJob
    queue_as :default
  
    def perform(comment_id)
      comment = Comment.find(comment_id)
      analyzer = Sentimental.new(threshold: 0.1)
      analyzer.load_defaults
      sentiment = analyzer.sentiment ActionController::Base.helpers.strip_tags(comment.description)
      comment.update_column(:sentiment, Comment.sentiments[sentiment])
    end
  end
  