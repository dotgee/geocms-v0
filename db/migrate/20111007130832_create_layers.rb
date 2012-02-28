class CreateLayers < ActiveRecord::Migration
  def change
    create_table :layers do |t|
      t.text :wms_url
      t.string :name
      t.string :description
      t.string :origin
      t.text :metadata_url

      t.timestamps
    end
  end
end
