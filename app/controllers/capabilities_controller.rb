class CapabilitiesController < ApplicationController
  #DEFAULT_GEOSERVER = "http://geobretagne.fr/geoserver/wms"
  DEFAULT_GEOSERVER = "http://geo.devel.dotgee.fr/geoserver/wms"
  def index
    layers =  WMS::Client.new(DEFAULT_GEOSERVER).layers
    render :json => layers
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

end
