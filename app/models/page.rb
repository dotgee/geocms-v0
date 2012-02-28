class Page < ActiveRecord::Base
  extend FriendlyId
  friendly_id :title, :use => :slugged
  scope :published, lambda { where({:published => true})}
  scope :not_published, lambda { where({:published => false})}
  acts_as_list :scope => :menu_id
  belongs_to :menu
  before_save :ensure_in_list

  def ensure_in_list
    return true if menu_id.nil?
    add_to_list_bottom if !in_list?
  end
end
