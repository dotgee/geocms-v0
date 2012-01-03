class AddImportedAtToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :imported_at, :datetime
  end
end
