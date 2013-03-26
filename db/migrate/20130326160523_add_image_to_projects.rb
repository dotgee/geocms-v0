class AddImageToProjects < ActiveRecord::Migration
  def change
        add_column :geo_contexts, :visuel_file_name, :string
        add_column :geo_contexts, :visuel_content_type, :string
        add_column :geo_contexts, :visuel_file_size, :integer
  end
end
