class CreateTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :tickets do |t|
      t.string :subject, null: false
      t.text :description, null: false
      t.string :email, null: false, index: true
      t.string :name, null: false
      t.integer :status, default: 0
      t.integer :sentiment, default: 0
      t.datetime :last_activity
      t.date :due_date
      t.references :creator, null: true, foreign_key: {to_table: :users}
      t.references :assignee, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
