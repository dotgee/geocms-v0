class Layer < ActiveRecord::Base
  acts_as_taggable
  validates_presence_of :wms_url, :name, :title
  validates_format_of :wms_url, :with => URI::regexp(%w(http https))

  before_validation :set_title_if_empty
  #belongs_to :geo_server
  belongs_to :data_source

  has_many :assigned_layer_taxons, 
           :dependent => :destroy
  has_many :themes, 
            :source => :taxon, 
            :through => :assigned_layer_taxons,
            #:conditions =>  "taxons.parent_id = #{AppConfig.theme_id}" ,
            :uniq => true
  #has_many :filters, :source => :taxon, :through => :assigned_layer_taxons, :conditions => { :parent_id => AppConfig.filter_id }
  belongs_to :filter, :class_name => "Taxon", :conditions => { :parent_id => AppConfig.filter_id }

  scope :published, :conditions => {:published => true}
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

  def filter_name
    filter.nil? ? "no_filter" : filter.name
  end

  def thumbnail_url(options = {})
    return nil if geo_server.nil?
    return geo_server.layer_thumbnail_url(self, options)
  end

end
