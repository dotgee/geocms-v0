class AddShowDownloadLinkToLayer < ActiveRecord::Migration
  def change
    add_column :layers, :show_download, :boolean, :default => true
  end
end
