class Page < ActiveRecord::Base
  extend FriendlyId
  friendly_id :title, :use => :slugged
  scope :published, lambda { where({:published => true})}
  acts_as_list :scope => :menu
end
