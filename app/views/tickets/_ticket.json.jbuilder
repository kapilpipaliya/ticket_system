json.extract! ticket, :id, :subject, :description, :email_of_submitter, :name_of_submitter, :created_at, :updated_at
json.url ticket_url(ticket, format: :json)
