ActiveAdmin.register Layer do
  form :partial => "admin/layers/form"
  sidebar "Autres actions" do
    div link_to "Moissonnage", moissonnage_admin_layers_path, :class => "btn primary"
    hr
  end
  # @todo Faire un client WFS pour recuperer ces infos
  controller do
    def edit
      @layer = Layer.find(params[:id]) 
      #c = Curl::Easy.perform("#{@layer.wms_url}?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName=#{@layer.name}")
      #doc = Nokogiri::XML(c.body_str)

    end

    def create_layer_from_geoserver(layer_infos, server_url)
        conditions = { :wms_url => server_url,
                       :name => layer_infos.name }
         new_layer = Layer.where( conditions).first
         new_layer = Layer.new({
            :title => layer_infos.title,
            :description => layer_infos.title,
            :tag_list => layer_infos.tag_list,
            :metadata_url => layer_infos.metadata_url
          }.merge(conditions)) if new_layer.nil?
        new_layer.save
    end
  end

  collection_action :moissonnage do
  end

  collection_action :list_capabilities, :method => :post do 
    @layers =  WMS::Client.new(params[:server][:url]).layers  
    @existing_layers = Layer.where(:name => @layers.map(&:name)).select(:name).map(&:name)
    render :action => :moissonnage
  end

  collection_action :import, :method => :post do
    url = params[:import][:server_url]
    layers_to_import = params[:import][:layer_name] || []
     @layers =  WMS::Client.new(url).layers.select{|l| layers_to_import.include?(l.name)}
     @layers.map do  |layer|
        #create_layer_from_geoserver(layer, geo_server)
      end 
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
  filter :wms_url, :label => "Serveur", :as => :select, :collection => proc { Layer.select('distinct wms_url').map(&:wms_url)}

  index do
    id_column
    column "Titre", :title
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
end
