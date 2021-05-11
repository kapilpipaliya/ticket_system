supporters = []
2.times do |i|
  user = User.new(first_name: "Support-#{i + 1}", last_name: "Taron-#{i + 1}", role: "support", email: "support#{i + 1}@example.com", password: "password", password_confirmation: "password")
  user.skip_confirmation! # confirm user email
  user.save!
  supporters.push user
end

customers = []
2.times do |i|
  user = User.new(first_name: "Customer-#{i + 1}", last_name: "Taron-#{i + 1}", role: "customer", email: "customer#{i + 1}@example.com", password: "password", password_confirmation: "password")
  user.skip_confirmation!
  user.save!
  customers.push user
end

tickets = []
100.times do |i|
  created_at = Time.zone.now - (2..15).to_a.sample.days
  ticket = Ticket.new(
    { subject: Faker::Hipster.sentence,
      description: Faker::Hipster.paragraph,
      email: Faker::Internet.email,
      name: Faker::Name.name_with_middle,
      created_at: created_at,
      due_date: created_at + 5.days
    }
  )
  ticket.send_notification = false
  ticket.save!
  tickets.push ticket
end

100.times do |c|
  supporter = supporters[Faker::Number.between(from: 0, to: 1)]
  comments = Comment.create!(
    [{
       description: Faker::Hipster.paragraph,
       ticket: tickets[c],
       commenter: supporter,
       created_at: tickets[c].created_at + 1.days
     }, {
       description: Faker::Hipster.paragraph,
       ticket: tickets[c],
       commenter: supporter,
       created_at: tickets[c].created_at + 2.days
     }])
end
