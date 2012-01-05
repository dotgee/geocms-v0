class Layer < ActiveRecord::Base
  extend FriendlyId
  friendly_id :title, :use => :slugged

  BZH_BOUNDING_BOX = "107541.6939208,6695593.1199368,429188.7088872,6901055.8519306"
  acts_as_taggable
  validates_presence_of :wms_url, :name, :title
  validates_format_of :wms_url, :with => URI::regexp(%w(http https))

  before_validation :set_title_if_empty, :set_wms_url
  belongs_to :data_source
  before_validation :strip_whitespace
  has_many :assigned_layer_taxons

  has_many :themes, 
            :class_name => "Taxon",
            :source => :taxon,
            :through => :assigned_layer_taxons,
            :uniq => true

  belongs_to :filter

  scope :published, :conditions => {:published => true}
  scope :drafts, :conditions => {:published => false}
  scope :recent, order('coalesce (modification_date, publication_date, created_at) desc')
  scope :recent_published, recent.published

  searchable do 
    text :description
    text :title
    integer :theme_ids, :multiple => true
    text :tag_text, :more_like_this => true do
      tags.compact.map(&:name).join(' ')
    end
    text :themes_name do
      themes.map(&:name)
    end
    text :filter_name do
      filter_name
    end
    boolean :published
  end

  def set_title_if_empty
    if title.blank?
      title = name
    end
  end

  def category_list
    themes.map(&:name).join(', ')
  end

  def uniq_identifier
    name.gsub(":","_")
  end

  def geonetwork_identifier
    return nil if metadata_url.blank?
    return @geonetwork_identifier if @geonetwork_identifier
    params = CGI.parse(metadata_url.split('?').pop)
    uuid = params.detect{|k,v| k == "uuid" }.last
    @geonetwork_identifier =  uuid.first unless uuid.nil?
    @geonetwork_identifier
  end
  
  def metadata_link
    return "" if metadata_url.blank?
    uri = URI.parse(metadata_url)
    uri.fragment = nil
    path = uri.path.split('/')[1] || ""
    uri.path = "/"+path
    return ["#{url.to_s}/srv/fr/metadata.show.embedded", "uuid=#{metadata_identifier}"].join('?')
  end

  def csw_url
    return @csw_url if @csw_url
    @csw_url = metadata_url.split('?').first
    @csw_url
  end

  def filter_name
    filter.nil? ? "no_filter" : filter.name
  end

  def thumbnail_url(options = {})
       params = {      
           "LAYERS" => name, 
           "FORMAT" => CGI::escape("image/png"),
           "SERVICE" => "WMS", 
           "VERSION" => "1.1.1",
           "REQUEST" => "GetMap",
           "STYLES" => "", 
           "SRS" => CGI::escape("EPSG:2154"),
           "BBOX" => BZH_BOUNDING_BOX,
           "WIDTH" => "200",
           "HEIGHT" => "140"
          }.merge(options).to_a.map{|k,v| "#{k}=#{v}"}.join('&') 
      return [wms_url, params].join('?')
    #return nil if geo_server.nil?
    #return geo_server.layer_thumbnail_url(self, options)
  end

  def credit
    return credits unless credits.blank?
    return data_source.credits unless data_source.nil?
    return ""
  end

  def set_wms_url
    unless wms_url.blank?
      wms_url.slice!(-1) unless wms_url.match(/\?$/).nil?
    end
  end

  def last_date
    modification_date || publication_date || created_at 
  end

  private
  def strip_whitespace
    [metadata_url, metadata_identifier, wms_url, name].compact.map(&:strip!)
  end

end
