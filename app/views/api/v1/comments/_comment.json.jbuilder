# frozen_string_literal: true

json.extract! comment, :id, :description, :ticket_id, :created_at, :updated_at, :commenter_id,
              :sentiment, :sentiment_score
json.set! :commenter_name, comment.commenter ? comment.commenter.first_name : ''
json.url api_v1_comment_url(comment, format: :json)
