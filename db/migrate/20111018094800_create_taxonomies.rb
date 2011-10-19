class CreateTaxonomies < ActiveRecord::Migration
  def change
    create_table :taxonomies do |t|
      t.string :name
      t.integer :root_id

      t.timestamps
    end
  end
end
