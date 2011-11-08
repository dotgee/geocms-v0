class Layer < ActiveRecord::Base
  acts_as_taggable
  validates_presence_of :wms_url, :name, :title
  validates_format_of :wms_url, :with => URI::regexp(%w(http https))

  before_validation :set_title_if_empty

  has_many :assigned_layer_taxons
  has_many :taxons, :through => :assigned_layer_taxons


  def set_title_if_empty
    if title.blank?
      title = name
    end
  end

  def category_list
    taxons.map(&:name).join(', ')
  end

  def uniq_identifier
    [wms_url.underscore, name.underscore].join('_').gsub(/[^\w]/,"_")
  end

end
