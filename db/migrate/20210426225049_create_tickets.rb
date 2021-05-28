class CreateTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :tickets, id: :uuid do |t|
      t.string :subject
      t.text :description
      t.string :email, index: true
      t.string :name
      t.integer :status, default: 0
      t.integer :sentiment
      t.float :sentiment_score, default: 0
      t.datetime :last_activity
      t.date :due_date
      t.references :creator, type: :uuid, null: true, foreign_key: {to_table: :users}
      t.references :assignee, type: :uuid, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
