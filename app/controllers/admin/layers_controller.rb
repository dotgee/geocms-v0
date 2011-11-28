class Admin::LayersController < CmsAdmin::BaseController
  before_filter :authenticate_user!

  def from_geoserver
    url = params[:wms_url]
    name = params[:name]
    layer = WMS::Client.new(url).layers.select{|l| name == l.name}.first
    unless layer.nil?
      render :json =>  layer 
    else
      render :json => {"error" => "Aucune carte trouv&eacute;e"}
    end
  end

  def from_geonetwork
    begin
      client =  Csw::Client.from_geonetwork_url(params[:url])
      rep = client.for_layer
      rep = { "error" => "Aucune information trouv&eacute;"} if rep.empty?
      render :json => rep
    rescue => e
      render :json => {"error" => "Une erreur est survenue veuiller v&eacute;rifier le format de l'url."}
    end
  end
  
  def show

  end

  def index
    @layers = Layer.page(page).order('created_at desc')
  end

  def new
    @layer = Layer.new
  end

  def create
  end

  def edit
  end

  def update
  end

  private

end
