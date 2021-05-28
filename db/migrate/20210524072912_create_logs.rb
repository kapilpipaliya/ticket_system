class CreateLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :logs, id: :uuid do |t|
      t.string :activity, null: false
      t.timestamps
    end
  end
end
