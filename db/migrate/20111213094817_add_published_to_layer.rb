class AddPublishedToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :published, :boolean, :default => false
  end
end
