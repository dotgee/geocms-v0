class RssController < ApplicationController
  def layers
    @layers = Layer.recent_published.limit(25)
    respond_to do |format|
      format.xml { render :layout => false } 
      format.rss { render :layout => false } 
      format.atom { render :layout => false } 
    end
  end

end
