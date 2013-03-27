class TagController < ApplicationController
  def show
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    @layers = Layer.published.tagged_with(@tag).page(page)
    @geo_contexts = GeoContext.tagged_with(@tag).page(page)
  end

end
