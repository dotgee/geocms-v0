class AddRoleIdToAdminUser < ActiveRecord::Migration
  def change
    add_column :admin_users, :role_id, :integer
  end
end
