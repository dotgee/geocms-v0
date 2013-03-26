class CreateGroupProjects < ActiveRecord::Migration
  def change
    create_table :group_projects do |t|
      t.string :name
      t.text :description
      t.integer :position
      t.timestamps
    end
  end
end
