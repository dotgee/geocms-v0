class Layer < ActiveRecord::Base
  validates_presence_of :wms_url, :name, :title
  validates_format_of :wms_url, :with => URI::regexp(%w(http https))

  before_validation :set_title_if_empty

  has_many :assigned_categories, :as => :categorisable
  has_many :categories, :through => :assigned_categories


  def set_title_if_empty
    if title.blank?
      title = name
    end
  end

  def category_list
    categories.map(&:name).join(', ')
  end

end
