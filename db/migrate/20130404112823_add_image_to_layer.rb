class AddImageToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :visuel_file_name, :string
    add_column :layers, :visuel_content_type, :string
    add_column :layers, :visuel_file_size, :integer
  end
end
