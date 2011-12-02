class Taxon < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => :slugged
  acts_as_nested_set :dependent => :destroy

  belongs_to :taxonomy
  has_many :assigned_layer_taxons
  has_many :layers, :through => :assigned_layer_taxons

  validates :name, :presence => true, :uniqueness => true

  class << self
    include CollectiveIdea::Acts::NestedSet::Helper
    def themes_select
      themes = Taxon.find("themes").descendants
      nested_set_options(themes) {|i| "#{'-' * (i.level - 1)} #{i.name }"}
    end

    def filters_select
      filters = Taxon.find("filtres").descendants
      nested_set_options(filters) {|i| i.name }
    end
  end
end
