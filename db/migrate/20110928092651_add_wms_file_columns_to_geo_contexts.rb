class AddWmsFileColumnsToGeoContexts < ActiveRecord::Migration
  def self.up
    add_column :geo_contexts, :wmc_file_name,    :string
    add_column :geo_contexts, :wmc_content_type, :string
    add_column :geo_contexts, :wmc_file_size,    :integer
    add_column :geo_contexts, :wmc_updated_at,   :datetime
  end

  def self.down
    remove_column :geo_contexts, :wmc_file_name
    remove_column :geo_contexts, :wmc_content_type
    remove_column :geo_contexts, :wmc_file_size
    remove_column :geo_contexts, :wmc_updated_at
  end
end
