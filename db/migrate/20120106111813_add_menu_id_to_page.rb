class AddMenuIdToPage < ActiveRecord::Migration
  def change
    add_column :pages, :menu_id, :integer
  end
end
