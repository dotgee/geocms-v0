class CreateGeoContexts < ActiveRecord::Migration
  def change
    create_table :geo_contexts do |t|
      t.string :name
      t.text :description
      t.string :wmc_name
      t.string :keywords

      t.timestamps
    end
  end
end
