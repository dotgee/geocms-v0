class HomeController < ApplicationController
  def index
    @geo_context = GeoContext.find("default") || GeoContext.last
    render :template => "geo_contexts/show"
  end
end
