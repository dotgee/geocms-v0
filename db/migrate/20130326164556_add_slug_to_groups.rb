class AddSlugToGroups < ActiveRecord::Migration
  def change
    add_column :group_projects, :slug, :string
    add_index :group_projects, :slug, :unique => true
  end
end
