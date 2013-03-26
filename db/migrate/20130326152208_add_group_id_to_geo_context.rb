class AddGroupIdToGeoContext < ActiveRecord::Migration
  def change
    add_column :geo_contexts, :group_id, :integer
  end
end
