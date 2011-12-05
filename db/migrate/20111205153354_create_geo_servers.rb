class CreateGeoServers < ActiveRecord::Migration
  def change
    create_table :geo_servers do |t|
      t.string :name
      t.string :url
      t.string :background_default_name

      t.timestamps
    end
  end
end
