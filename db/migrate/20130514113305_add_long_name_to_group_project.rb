class AddLongNameToGroupProject < ActiveRecord::Migration
  def change
    add_column :group_projects, :long_name, :string
  end
end
