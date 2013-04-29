class AddShowMetadataToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :show_metadata, :boolean, :default => true

  end
end
