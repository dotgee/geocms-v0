class CreateTaxons < ActiveRecord::Migration
  def change
    create_table :taxons do |t|
      t.integer :parent_id
      t.integer :taxonomy_id
      t.string :name
      t.integer :lft
      t.integer :rgt

      t.timestamps
    end
  end
end
