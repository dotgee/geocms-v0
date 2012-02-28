class AddLibelleToTaxon < ActiveRecord::Migration
  def change
    add_column :taxons, :libelle, :string
  end
end
