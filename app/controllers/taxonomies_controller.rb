class TaxonomiesController < ApplicationController
  layout 'fixed'
  # GET /taxonomies
  # GET /taxonomies.json
  def index
    @taxonomies = Taxonomy.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @taxonomies }
    end
  end

  # GET /taxonomies/1
  # GET /taxonomies/1.json
  def show
    @taxonomy = Taxonomy.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @taxonomy }
    end
  end

  # GET /taxonomies/new
  # GET /taxonomies/new.json
  def new
    @taxonomy = Taxonomy.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @taxonomy }
    end
  end

  # GET /taxonomies/1/edit
  def edit
    @taxonomy = Taxonomy.find(params[:id])
  end

  # POST /taxonomies
  # POST /taxonomies.json
  def create
    @taxonomy = Taxonomy.new(params[:taxonomy])

    respond_to do |format|
      if @taxonomy.save
        format.html { redirect_to @taxonomy, notice: 'Taxonomy was successfully created.' }
        format.json { render json: @taxonomy, status: :created, location: @taxonomy }
      else
        format.html { render action: "new" }
        format.json { render json: @taxonomy.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /taxonomies/1
  # PUT /taxonomies/1.json
  def update
    @taxonomy = Taxonomy.find(params[:id])

    respond_to do |format|
      if @taxonomy.update_attributes(params[:taxonomy])
        format.html { redirect_to @taxonomy, notice: 'Taxonomy was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @taxonomy.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /taxonomies/1
  # DELETE /taxonomies/1.json
  def destroy
    @taxonomy = Taxonomy.find(params[:id])
    @taxonomy.destroy

    respond_to do |format|
      format.html { redirect_to taxonomies_url }
      format.json { head :ok }
    end
  end
end
