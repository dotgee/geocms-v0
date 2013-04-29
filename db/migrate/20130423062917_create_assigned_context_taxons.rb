class CreateAssignedContextTaxons < ActiveRecord::Migration
  def change
    create_table :assigned_context_taxons do |t|
      t.integer :geo_context_id
      t.integer :taxon_id

      t.timestamps
    end

    add_index :assigned_context_taxons, :geo_context_id, :name => "a_c_t_geo"
    add_index :assigned_context_taxons, :taxon_id, :name => "a_c_t_tax"
    add_index :assigned_context_taxons, [:geo_context_id, :taxon_id], :name => "a_c_t_tax_geo"
  end
end
