class AssignedLayerTaxon < ActiveRecord::Base
  belongs_to :layer
  belongs_to :taxon
end
