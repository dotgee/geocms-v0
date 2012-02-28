class ChangeColumnMenuToInMenuToPage < ActiveRecord::Migration
  def up
    rename_column :pages, :menu, :in_menu
  end

  def down
    rename_column :pages, :in_menu, :menu
  end
end
