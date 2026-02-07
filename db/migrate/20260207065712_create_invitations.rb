class CreateInvitations < ActiveRecord::Migration[7.1]
  def change
    create_table :invitations do |t|
      t.string :email
      t.references :account, null: false, foreign_key: true
      t.integer :role
      t.string :token
      t.datetime :accepted_at

      t.timestamps
    end
    add_index :invitations, :token
  end
end
