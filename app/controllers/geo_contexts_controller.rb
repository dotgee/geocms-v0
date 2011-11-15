class GeoContextsController < ApplicationController
  before_filter :set_layout
  load_and_authorize_resource

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

  # GET /geo_contexts/new
  # GET /geo_contexts/new.json
  def new
    #@geo_context = GeoContext.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @geo_context }
    end
  end

  # GET /geo_contexts/1/edit
  def edit
    #@geo_context = GeoContext.find(params[:id])
  end

  # POST /geo_contexts
  # POST /geo_contexts.json
  def create
    #@geo_context = GeoContext.new(params[:geo_context])

    respond_to do |format|
      if @geo_context.save
        format.html { redirect_to @geo_context, notice: 'Geo context was successfully created.' }
        format.json { render json: @geo_context, status: :created, location: @geo_context }
      else
        format.html { render action: "new" }
        format.json { render json: @geo_context.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /geo_contexts/1
  # PUT /geo_contexts/1.json
  def update
    #@geo_context = GeoContext.find(params[:id])

    respond_to do |format|
      if @geo_context.update_attributes(params[:geo_context])
        format.html { redirect_to @geo_context, notice: 'Geo context was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @geo_context.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /geo_contexts/1
  # DELETE /geo_contexts/1.json
  def destroy
    @geo_context = GeoContext.find(params[:id])
    @geo_context.destroy

    respond_to do |format|
      format.html { redirect_to geo_contexts_url }
      format.json { head :ok }
    end
  end
  private

  def set_layout
    self.class.layout('application') if action_name == "show"
  end
end
