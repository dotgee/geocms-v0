class GroupProject < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => :slugged
  
  default_scope :order => "position asc"
  has_many :geo_contexts, :foreign_key => :group_id, :order => "diffusion_date desc"
end
