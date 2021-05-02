json.extract! comment, :id, :title, :description, :ticket_id, :created_at, :updated_at, :commenter_id
json.set! :commenter_name, comment.commenter.first_name
json.url comment_url(comment, format: :json)
