class AddPublishedToPage < ActiveRecord::Migration
  def change
    add_column :pages, :published, :boolean, :default => true
  end
end
