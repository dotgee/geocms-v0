class Taxonomy < ActiveRecord::Base
  has_many :taxons
  has_one :root, :class_name => "Taxon", :conditions => { :parent_id => nil }
  validates :name, :presence => true
  
  after_save :set_name
  
  private
  def set_name
    if self.root
      self.root.update_attribute(:name, self.name)
    else
      self.root = Taxon.create!({ :taxonomy_id => self.id, :name => self.name })
    end
  end
end
