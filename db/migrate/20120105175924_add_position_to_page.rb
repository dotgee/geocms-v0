class AddPositionToPage < ActiveRecord::Migration
  def change
    add_column :pages, :position, :integer, :default => nil
  end
end
