class CreateTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :tickets do |t|
      t.string :subject
      t.text :description
      t.string :email
      t.string :name
      t.string :status, default: 'open'
      t.references :creator, null: true, foreign_key: {to_table: :users}
      t.references :assignee, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
