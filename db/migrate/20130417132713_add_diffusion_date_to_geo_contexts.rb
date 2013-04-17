class AddDiffusionDateToGeoContexts < ActiveRecord::Migration
  def change
    add_column :geo_contexts, :diffusion_date, :datetime
  end
end
