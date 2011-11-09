class AddSlugToTaxon < ActiveRecord::Migration
  def change
    #add_column :taxons, :slug, :string
    add_index :taxons, :slug, :unique => true
  end
end
