class RssController < ApplicationController
  def layers
    @layers = Layer.limit(25).order('created_at desc')
    render :xml => @layers
  end

end
