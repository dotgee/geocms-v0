class AddCreditsAndRightsToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :credits, :text
    add_column :layers, :rights, :text
  end
end
