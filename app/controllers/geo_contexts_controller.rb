class GeoContextsController < ApplicationController
  before_filter :set_layout
  before_filter :clearGon 
  load_and_authorize_resource


  def print_img
    require 'RMagick'
    require 'open-uri'

    i = Magick::ImageList.new
    params[:tiles].inject(nil) do |img, tile|
      tile_img = image_from_params(tile.last) 
      i << tile_img
    end
    final_img = i.flatten_images

    final_img.crop!(params[:x].to_i.abs, params[:y].to_i.abs, params[:width].to_i, params[:height].to_i)
    file_name = File.join("wmcs","#{Time.now.to_i}.png")
    name = File.join(Rails.root, "public", file_name)
    final_img.write(name)
    render :text => file_name 
  end

  def image_from_params(params)
    img = Magick::Image.from_blob(open(params[:url]).read)
    img.first
  end

  def external
    @geo_context = GeoContext.find(params[:id])
    render :layout => 'external'
  end


  def permalink
    @wmc = REDIS.get(params[:key])
    @wmc = Nokogiri::XML::Document.parse(@wmc)
    if params[:single_tile]
      doc = @wmc
      doc.xpath("//xmlns:Extension/ol:singleTile", doc.namespaces.merge('ol' => 'http://openlayers.org/context')).each do |l|
        l.content = true
      end
      @wmc = doc.to_xml
    end
    render :xml => @wmc
  end

  def download
    @wmc = REDIS.get(params[:key])
    send_data @wmc, :filename => params[:name] << '.wmc'
  end

  def load
    str =  request.body.read
    id = save_context(str)
    render :json => { :success => true, :content => id }
  end

  def post
    id = save_context(params[:wmc])
    render :text => id
  end  

  def permalink_map
    @geo_context = GeoContext.find(params[:id])
    render :layout => false
    headers["Content-Type"] = "text/javascript"
  end

  def index
    @geo_contexts = GeoContext.page(page)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render :json =>  @geo_contexts }
    end
  end

  def show
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render :json =>  @geo_context }
    end
  end

  def home
    @geo_context = GeoContext.last
    render :template => "geo_contexts/show"
  end

  def set_layout
    layout_name = "application"
    self.class.layout(layout_name)
  end

  private
  def save_context(wmc)
    if(session[:wmc] == nil)
      uuid = UUID.new
      id = uuid.generate
    else
      id = session[:wmc]
    end
    REDIS.set(id, wmc)
    return id
  end

  def clearGon
    gon.clear
  end
end
