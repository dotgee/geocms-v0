class GroupProject < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, :use => :slugged

  has_many :geo_contexts, :foreign_key => :group_id
end
