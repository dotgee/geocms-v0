class HomeController < ApplicationController
  def index
    @geo_context = GeoContext.find_by_id(AppConfig.home_context_id) || GeoContext.find_by_name("Default") || GeoContext.last
    render :template => "geo_contexts/show"
  end
end
