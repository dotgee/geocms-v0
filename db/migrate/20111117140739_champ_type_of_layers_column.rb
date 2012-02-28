class ChampTypeOfLayersColumn < ActiveRecord::Migration
  def up
    change_column :layers, :description, :text
  end

  def down
    change_column :layers, :description, :string
  end
end
