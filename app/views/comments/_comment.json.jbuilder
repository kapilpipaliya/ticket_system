json.extract! comment, :id, :title, :description, :ticket_id, :created_at, :updated_at, :commented_by_id
json.set! :commented_by_name, comment.commented_by.first_name
json.url comment_url(comment, format: :json)
