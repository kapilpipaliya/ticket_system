json.extract! ticket, :id, :subject, :description, :email, :name, :status, :creator_id, :assignee_id, :created_at, :updated_at, :last_activity
json.set! :assignee_name, ticket.assignee ? ticket.assignee.first_name : ''
json.set! :assignee_comments, (ticket.has_attribute? :assignee_comments) ? ticket.assignee_comments : 0
json.url api_v1_tickets_url(ticket, format: :json)
