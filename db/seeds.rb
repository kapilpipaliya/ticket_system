supporters = []
2.times do |i|
  user = User.new(first_name: "Support-#{i + 1}", last_name: "Taron-#{i + 1}", role: "support", email: "support#{i+1}@example.com", password: "password", password_confirmation: "password")
  user.skip_confirmation! # confirm user email
  user.save!
  supporters.push  user
end

customers  = []
2.times do |i|
  user = User.new(first_name: "Customer-#{i + 1}", last_name: "Taron-#{i + 1}", role: "customer", email: "customer#{i+1}@example.com", password: "password", password_confirmation: "password")
  user.skip_confirmation!
  user.save!
  customers.push user
end

tickets = []
100.times do |i|
  tickets.push Ticket.create!(
                          { subject: Faker::Hipster.sentence,
                            description: Faker::Hipster.paragraph,
                            email_of_submitter: Faker::Internet.email,
                            name_of_submitter: Faker::Name.name_with_middle }
                        )
end

100.times do |c|
  supporter = supporters[Faker::Number.between(from: 0, to: 1)]
  comments = Comment.create!([{
                               title: "Thanks for Ticket.",
                               description: Faker::Hipster.paragraph,
                               ticket: tickets[c],
                               commented_by: supporter
                             }, {
                               title: "Your order has been processed",
                               description: Faker::Hipster.paragraph,
                               ticket: tickets[c],
                               commented_by: supporter
                             }])
end
