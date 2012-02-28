class AddSlugToGeoContexts < ActiveRecord::Migration
  def up
    add_column :geo_contexts, :slug, :string
    add_index :geo_contexts, :slug, :unique => true
  end

  def down
    remove_column :geo_contexts, :slug
  end
end
