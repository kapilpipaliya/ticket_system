json.content {}
json.data { json.array! @tickets, partial: 'api/v1/tickets/ticket', as: :ticket }
json.pagy @pagy_meta
# json.pegy do
#   json.merge! @pagy_meta
# end
