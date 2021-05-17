json.extract! comment, :id, :description, :ticket_id, :created_at, :updated_at, :commenter_id
json.set! :commenter_name, comment.commenter.first_name
json.url api_v1_comment_url(comment, format: :json)
