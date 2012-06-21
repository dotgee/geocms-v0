class RssController < ApplicationController
  def layers
    @layers = Layer.limit(25).order('created_at desc')
    respond_to do |format|
      format.xml { render :layout => false } 
      format.rss { render :layout => false } 
      format.atom { render :layout => false } 
    end
  end

end
