class AddDataSourceIdToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :data_source_id, :integer
  end
end
