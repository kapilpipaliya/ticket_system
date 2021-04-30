class CreateTickets < ActiveRecord::Migration[6.1]
  def change
    create_table :tickets do |t|
      t.string :subject
      t.text :description
      t.string :email_of_submitter
      t.string :name_of_submitter
      t.string :status, default: 'open'
      t.references :created_by, null: true, foreign_key: {to_table: :users}
      t.references :assigned_to, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
