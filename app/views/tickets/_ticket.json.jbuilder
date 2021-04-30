json.extract! ticket, :id, :subject, :description, :email_of_submitter, :name_of_submitter, :status,:created_by_id, :assigned_to_id, :created_at, :updated_at
json.set! :assigned_to_name, ticket.assigned_to ? ticket.assigned_to.first_name : ''
json.url ticket_url(ticket, format: :json)
