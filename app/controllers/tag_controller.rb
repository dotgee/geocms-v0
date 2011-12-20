class TagController < ApplicationController
  def show
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    @layers = Layer.tagged_with(@tag)
  end

end
