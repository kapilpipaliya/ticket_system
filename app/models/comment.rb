class Comment < ApplicationRecord
  belongs_to :ticket
  belongs_to :commented_by, class_name: 'User'

  default_scope { order(created_at: :asc) }

end
