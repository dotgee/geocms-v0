class HomeController < ApplicationController
  def index
    @geo_context = GeoContext.first
    #render :template => "geo_contexts/show"
    @layer = last_layers.first
    render :template => "layers/show"
  end
end
