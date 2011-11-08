class CreateAssignedLayerTaxons < ActiveRecord::Migration
  def change
    create_table :assigned_layer_taxons do |t|
      t.integer :taxon_id
      t.integer :layer_id

      t.timestamps
    end
  end
end
