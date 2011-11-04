class CapabilitiesController < ApplicationController
  #DEFAULT_GEOSERVER = "http://geo.devel.dotgee.fr/geoserver/wms"
  DEFAULT_GEOSERVER = "http://geobretagne.fr/geoserver/wms"
  def index
    layers =  WMS::Client.new(DEFAULT_GEOSERVER).layers
    render :json => layers
  end

  def generate_layers
    layers =  WMS::Client.new(DEFAULT_GEOSERVER).layers
    layers.map{|l| l.wms_url = DEFAULT_GEOSERVER}

    render :json => layers

  end

end
