ActiveAdmin.register Layer do

  form :partial => "admin/layers/form"


  # @todo Faire un client WFS pour recuperer ces infos
  controller do
    def create_layer_from_geoserver(layer_infos, server_url, geo_serveur)
        conditions = { :wms_url => server_url,
                       :name => layer_infos.name }
         new_layer = Layer.where( conditions).first
         new_layer = Layer.new({
            :title => layer_infos.title,
            :description => layer_infos.title,
            :tag_list => layer_infos.tag_list,
            :metadata_url => layer_infos.metadata_url
          }.merge(conditions)) if new_layer.nil?
        new_layer.geo_server = geo_serveur
        new_layer.save
    end

  end
  
  collection_action :moissonnage do
  end

  collection_action :list_capabilities, :method => :post do 
    if params[:server][:type].downcase == "geoserver"
      @layers =  WMS::Client.new(params[:server][:url]).layers  
      @existing_layers = Layer.where(:name => @layers.map(&:name)).select(:name).map(&:name)
    else
      @search =  Csw::Client.new(params[:server][:url])
      @search.search
      @metadatas = @search.metadatas
       
      @existing_layers = Layer.where(:name => @metadatas.map(&:layer_name)).select(:name).map(&:name)
    end
    render :action => :moissonnage
  end

  collection_action :import_meta, :method => :post do
    url = params[:import][:server_url]
    #layers_to_import = params[:import][:layer_name] || []
  end

  collection_action :import, :method => :post do
    url = params[:import][:server_url]
    geo_server = GeoServer.find_by_id(params[:import][:server_id])
    layers_to_import = params[:import][:layer_name] || []
     @layers =  WMS::Client.new(url).layers.select{|l| layers_to_import.include?(l.name)}
     @layers.map do  |layer|
        create_layer_from_geoserver(layer, url, geo_server)
      end 
    redirect_to admin_layers_path
  end

  collection_action :from_geoserver, :method => :post do
    url = params[:wms_url]
    name = params[:name]
    layer = WMS::Client.new(url).layers.select{|l| name == l.name}.first
    unless layer.nil?
      render :json =>  layer
    else
      render :json => {"error" => "Aucune carte trouv&eacute;e"}
    end
  end

  collection_action :from_geonetwork, :method => :post do
    begin
      client =  Csw::Client.from_geonetwork_url(params[:url])
      rep = client.for_layer
      rep = { "error" => "Aucune information trouv&eacute;"} if rep.empty?
      render :json => rep
    rescue => e
      render :json => {"error" => "Une erreur est survenue veuiller v&eacute;rifier le format de l'url."}
    end
  end

  #index
  filter :title
  filter :description
  filter :name
  #filter :wms_url, :label => "Serveur", :as => :select, :collection => proc { Layer.select('distinct wms_url').map(&:wms_url)}

  index do
    id_column
    column "Titre", :title
    column "Geoserveur", :sortable => :geo_server_id do |g|
      link_to g.geo_server.name, admin_geo_server_path(g) if g.geo_server
    end
    column "Information" do |l|
     div do
      b "Description :"
      l.description
     end
      div do
        b "Wms Url :"
        l.wms_url
      end
      div do
        b "Nom wms"
        l.name
      end
    end
    default_actions
  end

  sidebar "Autres actions" do
    #div link_to "Moissonnage", moissonnage_admin_layers_path, :class => "btn primary"
    hr
  end
end
