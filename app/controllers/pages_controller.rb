class PagesController < ApplicationController
  def show
    begin
      @page = Page.published.find(params[:id], :select => "content, title, keywords")
    rescue ActiveRecord::RecordNotFound
      return render_404
      #raise ActionController::RoutingError.new('Not Found')
    end

    respond_to do |format|
      format.html 
      format.json {render :json => @page}
    end
  end
end
