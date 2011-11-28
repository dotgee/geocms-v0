class AddDateModificationToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :date_modification, :date
  end
end
