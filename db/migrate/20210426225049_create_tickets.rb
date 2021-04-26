class CreateTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :tickets do |t|
      t.string :title
      t.text :body
      t.string :email_of_submitter
      t.string :name_of_submitter

      t.timestamps
    end
  end
end
