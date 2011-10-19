class AssignedTaxon < ActiveRecord::Base
  belongs_to :taxon
  belongs_to :taxonable, :polymorphic => true
end
