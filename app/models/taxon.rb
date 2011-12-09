class Taxon < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => :slugged
  acts_as_nested_set :dependent => :destroy

  belongs_to :taxonomy
  has_many :assigned_layer_taxons
  has_many :layers, :through => :assigned_layer_taxons
  has_many :filtered_layers, :class_name => "Layer", :foreign_key => "filter_id"

  validates :name, :presence => true, :uniqueness => true
  
  scope :only_themes, lambda {
        
         where({:parent => Taxon.find('themes').id})
    }
  
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

    def themes
      Taxon.find("themes").children
    end

    def filtres
      Taxon.find("filtres").children
    end
  end

  def children_layers_length
    descendants.includes(:layers).inject(0) do |n,child|
      n += child.layers.length
      n
    end
  end
end
