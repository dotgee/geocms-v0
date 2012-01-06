class AddPositionToPage < ActiveRecord::Migration
  def change
    add_column :pages, :position, :integer, :default => 0
  end
end
