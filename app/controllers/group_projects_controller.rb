class GroupProjectsController < ApplicationController
  def show
    @group = GroupProject.find(params[:id])
    @geo_contexts = @group.geo_contexts.page(page)
  end
end
