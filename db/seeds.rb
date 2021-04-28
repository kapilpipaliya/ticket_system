# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
tickets = Ticket.create([
                          { title: "Theme customisation issue",
                            body: "just remove those things and also in option button add",
                            email_of_submitter: "John@gmail.com",
                            name_of_submitter: "John lui" },
                          { title: "Theme customisation issue",
                            body: "you need to create toolbar-options div only once in a page in your code",
                            email_of_submitter: "Amy@gmail.com",
                            name_of_submitter: "Amy Carson" },
                          { title: "Theme customisation issue",
                            body: "this div fill found every td tag in your page,",
                            email_of_submitter: "Velma@gmail.com",
                            name_of_submitter: "Velma Wilkins" },
                        ])
comments = Comment.create([{
                             title: "Thanks for Ticket.",
                             description: "We will reply within 24 hours",
                             ticket: tickets.first
                           }, {
                             title: "Your order has been processed",
                             description: "We shipped your order. please confirm the status",
                             ticket: tickets.first
                           }])
2.times do |i|
  User.create(first_name: "user-#{i + 1}", last_name: "Taron-#{i + 1}", email: "user-#{i+1}@example.com", password: "password", password_confirmation: "password")
end