# frozen_string_literal: true

json.array! [{ 'id' => '', 'first_name' => 'Nobody', 'last_name' => '' }]
json.array! @users, :id, :first_name, :last_name
