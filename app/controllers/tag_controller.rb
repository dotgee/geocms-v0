class TagController < ApplicationController
  def show
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    @layers = Layer.published.tagged_with(@tag).page(page)
    @geo_contexts = GeoContext.tagged_with(@tag).page(page)
  end

  def old_tag
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    redirect_to tag_path(@tag), :status => :moved_permanently
  end

end
