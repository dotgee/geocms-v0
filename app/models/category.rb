class Category < ActiveRecord::Base
  acts_as_nested_set

  validates_presence_of :name
  validates_uniqueness_of :name, :scope => [ :parent_id ]

  has_many :geocontexts, :class_name => 'GeoContext'
  has_many :assigned_categories
  has_many :layers, :through => :assigned_categories
            
  
end
