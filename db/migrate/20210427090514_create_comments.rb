class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments do |t|
      t.text :description
      t.belongs_to :ticket, null: false, foreign_key: true
      t.references :commenter, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
