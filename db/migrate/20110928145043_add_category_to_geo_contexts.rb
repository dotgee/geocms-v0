class AddCategoryToGeoContexts < ActiveRecord::Migration
  def up
    add_column :geo_contexts, :category_id, :integer
  end

  def down
    remove_column :geo_contexts, :category_id
  end
end
