class AddGeoServerIdToLayers < ActiveRecord::Migration
  def change
    add_column :layers, :geo_server_id, :integer
  end
end
