# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
admin_users = []
2.times do |i|
  admin_users.push User.create(first_name: "Support-#{i + 1}", last_name: "Taron-#{i + 1}", role: "support", email: "support#{i+1}@example.com", password: "password", password_confirmation: "password")
end
customers  = []
2.times do |i|
  customers.push User.create(first_name: "Customer-#{i + 1}", last_name: "Taron-#{i + 1}", role: "customer", email: "customer#{i+1}@example.com", password: "password", password_confirmation: "password")
end
tickets = Ticket.create([
                          { subject: "Theme customisation issue",
                            description: "just remove those things and also in option button add",
                            email_of_submitter: "John@gmail.com",
                            name_of_submitter: "John lui" },
                          { subject: "Theme customisation issue",
                            description: "you need to create toolbar-options div only once in a page in your code",
                            email_of_submitter: "Amy@gmail.com",
                            name_of_submitter: "Amy Carson" },
                          { subject: "Theme customisation issue",
                            description: "this div fill found every td tag in your page,",
                            email_of_submitter: "Velma@gmail.com",
                            name_of_submitter: "Velma Wilkins" },
                          { subject: "Customer1 - Theme customisation issue",
                            description: "just remove those things and also in option button add",
                            email_of_submitter: "John@gmail.com",
                            name_of_submitter: "John lui",
                            created_by: customers.first},
                          { subject: "Customer1 - Theme customisation issue",
                            description: "you need to create toolbar-options div only once in a page in your code",
                            email_of_submitter: "Amy@gmail.com",
                            name_of_submitter: "Amy Carson",
                            created_by: customers.first },
                          { subject: "Customer1 - Theme customisation issue",
                            description: "this div fill found every td tag in your page,",
                            email_of_submitter: "Velma@gmail.com",
                            name_of_submitter: "Velma Wilkins",
                            created_by: customers.first },
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
