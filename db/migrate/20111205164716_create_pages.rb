class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.text :content
      t.string :title
      t.text :description
      t.string :keywords

      t.timestamps
    end
  end
end
