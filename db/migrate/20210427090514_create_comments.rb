class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments do |t|
      t.text :description, null: false
      t.integer :sentiment, default: 0
      t.integer :sentiment_score, default: 0
      t.belongs_to :ticket, null: false, foreign_key: { on_delete: :cascade }
      t.references :commenter, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end