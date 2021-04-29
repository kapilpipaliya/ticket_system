class CreateTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :tickets do |t|
      t.string :subject
      t.text :description
      t.string :email_of_submitter
      t.string :name_of_submitter
      t.belongs_to :user, null: true, foreign_key: true

      t.timestamps
    end
  end
end
