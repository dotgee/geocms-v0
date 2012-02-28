class LayersController < ApplicationController
  before_filter :build_query, :only => :search
  before_filter :clearGon

  def wfs
    @layer = Layer.find(params[:id])
  end

  def get_javascript
    render :layout => false
  end

  def external
    @layer = Layer.find(params[:id])
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
      format.json { render :json => @layers }
      format.rss { render :layout => false }
    end
  end

  # GET /layers/1
  # GET /layers/1.json
  def show
    @layer = Layer.find(params[:id])
    # Pass data to javascript
    gon.layer = {"id" => @layer.id,
                 "wms_url" => @layer.wms_url,
                 "name" => @layer.name,
                 "title" => @layer.title,
                 "metadata" => @layer.metadata_link,
                 "credits" => @layer.credits}
    @geo_context = GeoContext.last
    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json => @layer }
    end
  end

  def find
    @layer = Layer.find_by_name(params[:id], :select => "metadata_url, metadata_identifier, template, credits")
    unless @layer.nil?
      layer = @layer.attributes
      layer[:metadataLink] = @layer.metadata_link
    end
    respond_to do |format|
      format.json { render :json =>  layer }
    end
  end

  def getfeatures
    @layer = Layer.find(params[:id])
    @features = WMS::Client.new(@layer.wms_url,{:layer_name => @layer.name}).features_list
    respond_to do |format|
      format.json { render :json =>  @features }
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

  def build_query
    unless params[:search].blank? || params[:search][:q].blank?
      

    else
      @layers = Layer.includes([:themes, :taggings]).page(page).order("created_at desc")
      return render :action => :index
    end
  end

  private
  def clearGon
    gon.clear
  end
end
