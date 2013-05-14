#encoding: UTF-8
class TagController < ApplicationController
  def show
    @layers = Layer.published.tagged_with(@tag).page(page)
    @geo_contexts = GeoContext.tagged_with(@tag).page(page)
  end

  def old_tag
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    redirect_to tag_path(@tag), :status => :moved_permanently
  end

  def set_bc
    super
    add_breadcrumb "Mots clés", nil
    add_breadcrumb @tag.name, tag_path(@tag) if entity
  end

  def entity
    @tag ||= ActsAsTaggableOn::Tag.find(params[:id])
  end
end
