class GeoContextsController < ApplicationController
  before_filter :set_layout
  load_and_authorize_resource

  def permalink
    @wmc = REDIS.get(params[:key])
    render :xml => @wmc
  end

  def download
    @wmc = REDIS.get(params[:key])
    send_data @wmc, :filename => params[:name] << '.wmc'
  end

  def load
    str =  request.body.read
    id = save_context(str)
    render :json => {:success => true, :content => id}
  end

  def post
    id = save_context(params[:wmc])
    render :text => id
  end  

  def permalink_map
    @geo_context = GeoContext.find(params[:id])
    render :layout => false
    headers["Content-Type"] = "text/javascript"
  end

  # GET /geo_contexts
  # GET /geo_contexts.json

  def index
    @geo_contexts = GeoContext.page(page)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @geo_contexts }
    end
  end

  # GET /geo_contexts/1
  # GET /geo_contexts/1.json
  def show
    #@geo_context = GeoContext.find(params[:id])
    
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @geo_context }
    end
  end

  private

  def set_layout
    #self.class.layout('application') if action_name == "show"
  end

  def save_context(wmc)
    if(session[:wmc] == nil)
      uuid = UUID.new
      id = uuid.generate
    else
      id = session[:wmc]
    end
    REDIS.set(id, wmc)
    return id
  end
end
