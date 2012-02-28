class CreateDataSources < ActiveRecord::Migration
  def change
    create_table :data_sources do |t|
      t.string :name
      t.string :conditions
      t.string :credits
      t.string :csw_url
      t.string :ogc_url
      t.string :wfs_url
      t.string :wms_url
      t.text :contact
      t.string :logo_file_name
      t.integer :logo_file_size
      t.string :logo_content_type
      t.timestamps
    end
  end
end
