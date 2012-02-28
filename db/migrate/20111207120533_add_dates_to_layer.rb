class AddDatesToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :publication_date, :datetime
    add_column :layers, :modification_date, :datetime
  end
end
