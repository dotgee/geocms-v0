module Admin
  class CapabilitiesController < ApplicationController
    before_filter :authenticate_user!
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
      geo_server = params[:geo_server_url] || DEFAULT_GEOSERVER
      layers =  WMS::Client.new(geo_server).layers
      layers.map do  |layer|
        create_layer_from_geoserver(layer, geo_server)
      end
      render :json => layers
    end
    
    private
    def create_layer_from_geoserver(layer_infos, server_url)
        conditions = { :wms_url => server_url,
                       :name => layer_infos.name }
         new_layer = Layer.where( conditions).first
         new_layer = Layer.new({
            :title => layer_infos.title,
            :description => layer_infos.title,
            :tag_list => layer_infos.tag_list,
            :metadata_url => layer_infos.metadata_url
          }.merge(conditions)) if new_layer.nil?
        new_layer.save
    end
  end
end
