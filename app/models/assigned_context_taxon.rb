class AssignedContextTaxon < ActiveRecord::Base
  belongs_to :geo_context
  belongs_to :taxon
end
