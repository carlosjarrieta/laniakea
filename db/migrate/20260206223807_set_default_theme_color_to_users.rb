class SetDefaultThemeColorToUsers < ActiveRecord::Migration[7.1]
  def change
    change_column_default :users, :theme_color, from: nil, to: 'zinc'
    # Also update existing users
    User.update_all(theme_color: 'zinc')
  end
end
