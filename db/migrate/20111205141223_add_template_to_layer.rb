class AddTemplateToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :template, :text
  end
end
