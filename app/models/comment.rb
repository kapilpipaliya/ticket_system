class Comment < ApplicationRecord
  belongs_to :ticket
  belongs_to :commenter, class_name: 'User'

  default_scope { order(created_at: :asc) }
end
