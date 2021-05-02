json.extract! ticket, :id, :subject, :description, :email, :name, :status,:creator_id, :assignee_id, :created_at, :updated_at
json.set! :assignee_name, ticket.assignee ? ticket.assignee.first_name : ''
json.url ticket_url(ticket, format: :json)
