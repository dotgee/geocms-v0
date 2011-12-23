class LayersController < ApplicationController
  before_filter :set_layout
  before_filter :build_query, :only => :search
  
  def wfs
    @layer = Layer.find(params[:id])
  end

  def get_javascript
    render :layout => false
  end

  def external
    @layer = Layer.find(params[:id])
    return render :text => "Not available" unless @layer.published
    render :layout => 'external' 
  end

  def search
    @results = Sunspot.search Layer do
      paginate :page => page, :per_page => 20
      keywords params[:search][:q] do 
        highlight :title, :description
      end
      with :published, true
      with(:theme_ids).all_of params[:theme_ids].map(&:to_i) if params[:theme_ids]
      facet :theme_ids
    end
  end
  # GET /layers
  # GET /layers.json
  def index

    @layers = Layer.recent_published.includes([:themes, :taggings]).page(page).per(20)
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @layers }
      format.rss { render :layout => false }
    end
  end

  # GET /layers/1
  # GET /layers/1.json
  def show
    @layer = Layer.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @layer }
    end
  end

  def getfeatures
    @layer = Layer.find(params[:id])
    @features = WMS::Client.new(@layer.wms_url,{:layer_name => @layer.name}).features_list
    respond_to do |format|
      format.json { render json: @features }
    end
  end

  # GET /layers/print
  def print
    @wmc = params[:wmc]
    render :layout => 'print_layout'
  end

  # GET /layers/new
  # GET /layers/new.json
  def new
    @layer = Layer.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @layer }
    end
  end

  # GET /layers/1/edit
  def edit
    @layer = Layer.find(params[:id])
  end

  # POST /layers
  # POST /layers.json
  def create
    @layer = Layer.new(params[:layer])

    respond_to do |format|
      if @layer.save
        format.html { redirect_to @layer, notice: 'Layer was successfully created.' }
        format.json { render json: @layer, status: :created, location: @layer }
      else
        format.html { render action: "new" }
        format.json { render json: @layer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /layers/1
  # PUT /layers/1.json
  def update
    @layer = Layer.find(params[:id])

    respond_to do |format|
      if @layer.update_attributes(params[:layer])
        format.html { redirect_to @layer, notice: 'Layer was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @layer.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /layers/1
  # DELETE /layers/1.json
  def destroy
    @layer = Layer.find(params[:id])
    @layer.destroy

    respond_to do |format|
      format.html { redirect_to layers_url }
      format.json { head :ok }
    end
  end

  def set_layout
    layout_name = "application"
    layout_name = "gipbe"
    self.class.layout(layout_name)
  end

  def build_query
    unless params[:search].blank? || params[:search][:q].blank?
      

    else
      @layers = Layer.includes([:themes, :taggings]).page(page).order("created_at desc")
      return render :action => :index
    end
  end
end
