class Layer < ActiveRecord::Base
  acts_as_taggable
  validates_presence_of :wms_url, :name, :title
  validates_format_of :wms_url, :with => URI::regexp(%w(http https))

  before_validation :set_title_if_empty

  has_many :assigned_layer_taxons
  has_many :themes, :source => :taxon, :through => :assigned_layer_taxons, :conditions => { :parent_id => AppConfig.theme_id }
  has_many :filters, :source => :taxon, :through => :assigned_layer_taxons, :conditions => { :parent_id => AppConfig.filter_id }


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

  def geonetwork_identifier
    return nil if metadata_url.blank?
    return @geonetwork_identifier if @geonetwork_identifier
    params = CGI.parse(metadata_url.split('?').pop)
    uuid = params.detect{|k,v| k == "uuid" }.last
    @geonetwork_identifier =  uuid.first unless uuid.nil?
    @geonetwork_identifier
  end

  def csw_url
    return @csw_url if @csw_url
    @csw_url = metadata_url.split('?').first
    @csw_url
  end

end
