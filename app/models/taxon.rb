class Taxon < ActiveRecord::Base
  acts_as_nested_set :dependent => :destroy

  belongs_to :taxonomy

  has_many :assigned_taxons
  has_many :taxonables, :through => :assigned_taxons

  validates :name, :presence => true, :uniqueness => true

end
