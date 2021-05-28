class CreateComments < ActiveRecord::Migration[6.1]
  def change
    create_table :comments, id: :uuid do |t|
      t.text :description, null: false
      t.integer :sentiment, default: 0
      t.float :sentiment_score, default: 0
      t.belongs_to :ticket, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.references :commenter, type: :uuid, null: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end