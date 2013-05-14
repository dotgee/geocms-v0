class PagesController < ApplicationController
  def show
    
    return render_404 unless @page

    respond_to do |format|
      format.html 
      format.json {render :json => @page}
    end
  end

  def set_bc
    super
    add_breadcrumb @page.title, page_path(@page) if entity
  end

  def entity
    begin
      @page = Page.published.find(params[:id], :select => "content, title, keywords, slug")
    rescue ActiveRecord::RecordNotFound
      #raise ActionController::RoutingError.new('Not Found')
    end
    @page
  end
end
