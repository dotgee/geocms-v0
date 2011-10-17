class AddTitleToLayers < ActiveRecord::Migration
  def change
    change_table :layers do |t|
      t.change :wms_url, :text, :length => 1024, :null => false
      t.change :name, :string, :null => false
      t.string :title, :null => false
      # t.index [ :wms_url, :name ], :unique => true
    end

  end
end
