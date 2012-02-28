class AddExternalToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :external, :boolean, :default => false
  end
end
