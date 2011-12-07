class AddFilterIdToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :filter_id, :integer
  end
end
