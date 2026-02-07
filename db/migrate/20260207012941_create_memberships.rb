class CreateMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :memberships do |t|
      t.references :user, null: false, foreign_key: true
      t.references :account, null: false, foreign_key: true
      t.integer :role, default: 0, null: false
      t.integer :status, default: 1, null: false

      t.timestamps
    end
  end
end
