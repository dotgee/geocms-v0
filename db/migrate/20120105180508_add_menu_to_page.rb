class AddMenuToPage < ActiveRecord::Migration
  def change
    add_column :pages, :menu, :boolean, :default => false
  end
end
