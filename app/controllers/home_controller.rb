class HomeController < ApplicationController
  def index
    @geo_context = GeoContext.first
    render :template => "geo_contexts/show"
  end
end
