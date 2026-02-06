class AddThemeColorToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :theme_color, :string
  end
end
