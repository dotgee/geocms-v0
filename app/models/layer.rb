class Layer < ActiveRecord::Base
  
  extend FriendlyId
  friendly_id :title, :use => :slugged

  BZH_BOUNDING_BOX = "107541.6939208,6695593.1199368,429188.7088872,6901055.8519306"
  has_attached_file :visuel, :styles => { :thumb => "150x100>" }, :url => "/system/:class/:attachment/:id/:style/:filename"

  acts_as_taggable
  validates_presence_of :wms_url, :name, :title
  validates_format_of :wms_url, :with => URI::regexp(%w(http https))

  before_validation :set_title_if_empty, :set_wms_url
  belongs_to :data_source
  before_validation :strip_whitespace
  before_save :ensure_thumb

  has_many :assigned_layer_taxons, :dependent => :destroy

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

  class << self

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
    name.gsub(":","_") + "#{id}"
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
    return nil if metadata_url.blank?
    begin
      uri = URI.parse(metadata_url)
      uri.fragment = nil
      path = uri.path.split('/')[1] || ""
      uri.path = "/"+path
      return ["#{uri.to_s}/srv/fr/metadata.show.embedded", "uuid=#{metadata_identifier}"].join('?')
    rescue => e
      return nil
    end
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
  
  def data_source_name
    return data_source.name if data_source
    "Couche externe"
  end

  def thumb
    visuel? ? visuel.url(:thumb) : thumbnail_url({"WIDTH" => "150", "HEIGHT" => "100" })
  end

  private
  def strip_whitespace
    [metadata_url, metadata_identifier, wms_url, name].compact.map(&:strip!)
  end
  
  def ensure_thumb
    if !visuel?
      generate_visuel
    end
  end

  def generate_visuel(save_me = false)
    begin
        t_url = thumbnail_url({"WIDTH" => "150", "HEIGHT" => "100" })
        data = `curl "#{t_url}" 2>/dev/null`.chomp
        t = Tempfile.new(["layer_thumb_temp", ".png"])
        t.binmode
        t.write(data)
        t.rewind
        self.visuel = t
        save if save_me
    rescue => e
      logger.info (e.message)
    end
  end

end
