class CreateAssignedTaxons < ActiveRecord::Migration
  def change
    create_table :assigned_taxons do |t|
      t.integer :taxon_id
      t.integer :taxonable_id
      t.string :taxonable_type

      t.timestamps
    end
  end
end
