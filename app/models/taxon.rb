class Taxon < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => :slugged
  acts_as_nested_set :dependent => :destroy

  #belongs_to :taxonomy
  has_many :assigned_layer_taxons
  has_many :layers, :through => :assigned_layer_taxons, :uniq => true

  validates :name, :presence => true, :uniqueness => true
  
  scope :only_themes, lambda {
        
         where({:parent => Taxon.find('themes').id})
    }
  scope :right_order, :order => "lft asc, rgt asc"

  class << self
    include CollectiveIdea::Acts::NestedSet::Helper
    include ActionView::Helpers::FormOptionsHelper
    def all_themes_select(selected = nil)
      
      options_for_select(Taxon.find('themes').descendants.right_order.map{|t| ["#{'-' *t.level}#{t.name}",t.id]}, selected)
      #nested_set_options(themes) {|i| "#{'-' * (i.level - 1)} #{i.name }"}
    end

    def themes_select(selected = nil)
      options_for_select(themes.map{|t| ["#{'-' *t.level}#{t.name}",t.id]}, selected)
    end


    def themes
      Taxon.find("themes").children
    end
  end

  def children_layers_length
    descendants.includes(:layers).inject(0) do |n,child|
      n += child.layers.length
      n
    end
  end
end
