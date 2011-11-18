class CapabilitiesController < ApplicationController
  DEFAULT_GEOSERVER = "http://geobretagne.fr/geoserver/wms"
  #DEFAULT_GEOSERVER = "http://geo.devel.dotgee.fr/geoserver/wms"
  def index
    if request.get?
    else
      @layers =  WMS::Client.new(params[:server][:url]).layers
    end
  end

  def import
    url = params[:import][:server_url]
    layers_name = params[:import][:layer_name]
    @layers =  WMS::Client.new(url).layers.select{|l| layers_name.include?(l.name)}
  end


  def generate_layers
    
    layers =  WMS::Client.new(DEFAULT_GEOSERVER).layers
    layers.map do  |layer|
      conditions = { :wms_url => DEFAULT_GEOSERVER,
                     :name => layer.name }
       new_layer = Layer.where( conditions).first
       new_layer = Layer.new({
          :title => layer.title,
          :description => layer.title,
          :metadata_url => layer.metadata_url
        }.merge(conditions)) if new_layer.nil?
      new_layer.save
    end
    render :json => layers
  end
  
  private
  def create_layer_from_geoserver(layer_infos, server_url)

  end
end
