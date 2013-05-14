class GroupProjectsController < ApplicationController
  def show
    @geo_contexts = @group.geo_contexts.page(page)
  end

  def set_bc
    super
    add_breadcrumb "Projets", nil
    add_breadcrumb @group.name, @group if entity
  end

  def entity
    @group ||= GroupProject.find(params[:id])
  end
end
