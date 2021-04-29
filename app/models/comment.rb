class Comment < ApplicationRecord
  belongs_to :ticket

  default_scope { order(created_at: :asc) }

end
