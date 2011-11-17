class Admin::LayersController < ApplicationController
  before_filter :authenticate_user!

  def from_geoserver
    render :json => {"ok" => "parfait"}
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
