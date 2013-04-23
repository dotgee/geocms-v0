class GeoContext < ActiveRecord::Base
  acts_as_taggable

  extend FriendlyId
  friendly_id :name, :use => :slugged
  has_attached_file :wmc
  has_attached_file :visuel, :styles => { :thumb => "150x100>" }

  belongs_to :taxon, :foreign_key => :category_id
  has_many :assigned_context_taxons, :dependent => :destroy

  has_many :themes,
            :class_name => "Taxon",
            :source => :taxon,
            :through => :assigned_context_taxons,
            :uniq => true

  validates_presence_of :name

  belongs_to :group, :class_name => "GroupProject"

  def wmc_content
    return nil if wmc.nil?
    return nil unless File.exists?(wmc.path)
    return File.read(wmc.path)
  end

  def title 
    name
  end

  def credits
    ""
  end
end
