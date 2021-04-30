json.content {}
json.data do
  json.array! @tickets, partial: "tickets/ticket", as: :ticket
end
json.pagy @pagy_meta
# json.pegy do
#   json.merge! @pagy_meta
# end