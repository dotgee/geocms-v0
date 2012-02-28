class Taxon < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => :slugged
  acts_as_nested_set 

  has_many :assigned_layer_taxons
  has_many :layers, :through => :assigned_layer_taxons, :uniq => true

  validates :name, :presence => true, :uniqueness => true
  
  scope :only_themes, lambda {
        
         where({:parent => Taxon.find('themes').id})
    }
  scope :right_order, :order => "lft asc, rgt asc"

  class << self
    include CollectiveIdea::Acts::NestedSet::Helper
    def all_themes_select
      Taxon.find('themes').self_and_descendants.right_order.map{|t| ["#{'-' *t.level}#{t.name}",t.id]}  
    end

    def themes_select(selected = nil)
      Taxon.find('themes').descendants.right_order.map{|t| ["#{'-' *(t.level - 1)}#{t.name}",t.id]}  
    end


    def themes
      theme = Taxon.find_by_slug("themes")
      return theme.children if theme
      return []
    end
  end

  def children_layers_length
    descendants.includes(:layers).inject(0) do |n,child|
      n += child.layers.length
      n
    end
  end
end
