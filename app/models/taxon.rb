class Taxon < ActiveRecord::Base
  acts_as_nested_set :dependent => :destroy

  belongs_to :taxonomy
  has_many :assigned_layer_taxons
  has_many :layers, :through => :assigned_layer_taxons

  validates :name, :presence => true, :uniqueness => true
end
