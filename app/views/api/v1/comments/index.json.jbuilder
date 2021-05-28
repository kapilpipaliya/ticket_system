# frozen_string_literal: true

json.array! @comments, partial: 'api/v1/comments/comment', as: :comment
