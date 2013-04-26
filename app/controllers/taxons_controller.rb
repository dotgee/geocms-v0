class TaxonsController < ApplicationController
  # GET /taxons
  # GET /taxons.json
  #
  def old_taxon
    @taxon = Taxon.find(params[:id])
    redirect_to taxon_path(@taxon), :status => :moved_permanently 
  end

  def layers
    @taxon = Taxon.find(params[:id])
    @layers = @taxon.layers.page(page).per(25)
    render :action => :show
  end

  def geo_contexts
    @taxon = Taxon.find(params[:id])
    @geo_contexts = @taxon.geo_contexts.page(page).per(20)

  end

  def index
    @taxons = Taxon.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @taxons }
    end
  end

  # GET /taxons/1
  # GET /taxons/1.json
  def show
    @taxon = Taxon.find(params[:id])
    @layers = @taxon.layers.page(page).per(25)
    @geo_contexts = @taxon.geo_contexts.page(page).per(25)
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @taxon }
    end
  end

  # GET /taxons/new
  # GET /taxons/new.json
  def new
    @taxon = Taxon.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @taxon }
    end
  end

  # GET /taxons/1/edit
  def edit
    @taxon = Taxon.find(params[:id])
  end

  # POST /taxons
  # POST /taxons.json
  def create
    @taxon = Taxon.new(params[:taxon])

    respond_to do |format|
      if @taxon.save
        format.html { redirect_to @taxon, notice: 'Taxon was successfully created.' }
        format.json { render json: @taxon, status: :created, location: @taxon }
      else
        format.html { render action: "new" }
        format.json { render json: @taxon.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /taxons/1
  # PUT /taxons/1.json
  def update
    @taxon = Taxon.find(params[:id])

    respond_to do |format|
      if @taxon.update_attributes(params[:taxon])
        format.html { redirect_to @taxon, notice: 'Taxon was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @taxon.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /taxons/1
  # DELETE /taxons/1.json
  def destroy
    @taxon = Taxon.find(params[:id])
    @taxon.destroy

    respond_to do |format|
      format.html { redirect_to taxons_url }
      format.json { head :ok }
    end
  end
end
