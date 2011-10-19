class CreateAssignedCategories < ActiveRecord::Migration
  def change
    create_table :assigned_categories do |t|
      t.integer :category_id
      t.string :categorisable_id
      t.string :categorisable_type

      t.timestamps
    end
  end
end
