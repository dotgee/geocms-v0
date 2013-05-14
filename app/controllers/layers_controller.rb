class LayersController < ApplicationController
  before_filter :set_layout
  before_filter :build_query, :only => :search
  before_filter :load_layer, :only => [:wfs, :external, :getfeatures, :show]
  
  def meta_links
    res = []
    render :json => res
  end

  def wfs
  end

  def get_javascript
    render :layout => false
  end

  def external
    @geo_context = GeoContext.first
    return render :text => "Not available" unless @layer.published
    render :layout => 'external' 
  end

  def search
    @results = Sunspot.search Layer do
      paginate :page => page, :per_page => 20
      keywords params[:search][:q] do 
        highlight :title, :description
      end
      with :published, true
      with(:theme_ids).all_of params[:theme_ids].map(&:to_i) if params[:theme_ids]
      facet :theme_ids
    end
  end
  # GET /layers
  # GET /layers.json
  def index

    @layers = Layer.recent_published.includes([:themes, :taggings]).page(page).per(20)
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @layers }
      format.rss { render :layout => false }
    end
  end

  # GET /layers/1
  # GET /layers/1.json
  def show
    @geo_context = GeoContext.first
    add_breadcrumb @layer.title

    set_seo(@layer)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @layer }
    end
  end

  def find
    @layer = Layer.find_by_name(params[:id], :select => "metadata_url, metadata_identifier, template, credits, show_metadata, show_download")
    unless @layer.nil?
      layer = @layer.attributes
      layer[:metadataLink] = @layer.metadata_link
      layer[:show_download] = @layer.show_download
    end
    respond_to do |format|
      format.json { render json: layer }
    end
  end

  def getfeatures
    @features = WMS::Client.new(@layer.wms_url,{:layer_name => @layer.name}).features_list
    respond_to do |format|
      format.json { render json: @features }
    end
  end

  # GET /layers/print
  def print
    @wmc = params[:wmc]
    render :layout => 'print_layout'
  end

  def pdf
    @wmc = REDIS.get(params[:key])
    @wmc = Nokogiri::XML::Document.parse(@wmc)

  end

  # GET /layers/new
  def set_layout
    layout_name = "application"
    layout_name = "gipbe"
    self.class.layout(layout_name)
  end

  def build_query
    unless params[:search].blank? || params[:search][:q].blank?
      

    else
      @layers = Layer.includes([:themes, :taggings]).page(page).order("created_at desc")
      return render :action => :index
    end
  end

  def load_layer
    @layer = Layer.find(params[:id])
  end

  def set_bc
    super
    add_breadcrumb "Catalogue", layers_path
    add_breadcrumb "Recherche", search_layers_path if action_name.to_sym == :search
  end
end
