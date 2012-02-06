ActiveAdmin.register Layer , :alias => I18n.t(:layer).html_safe do
  controller.authorize_resource
  scope :published, :default => true
  scope :drafts

  form :partial => "admin/layers/form"

  controller do
    before_filter :delete_published, :only => [:create, :update]
    def delete_published
      params[:layer].delete(:published) unless current_admin_user.role?('super_admin')
    end

    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end

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
  
  member_action :get_javascript do
    render :layout => false, :template => "layers/get_javascript"
  end

  collection_action :from_geoserver, :method => :post do
    url = params[:wms_url].split('?').first
    name = params[:name]
    puts url
    layer = WMS::Client.new(url).layers.select{|l| name == l.name}.first
    unless layer.nil?
      render :json =>  layer
    else
      render :json => {"error" => "Aucune carte trouv&eacute;e"}
    end
  end

  collection_action :from_geonetwork, :method => :post do
    begin
      url = [params[:url], "uuid=#{params[:identifier]}"].join('?')
      client =  Csw::Client.from_geonetwork_url(url)
      rep = client.for_layer
      rep = { "error" => "Aucune information trouv&eacute;"} if rep.empty?
      render :json => rep
    rescue => e
      puts e.inspect
      render :json => {"error" => "Une erreur est survenue veuiller v&eacute;rifier le format de l'url."}
    end
  end

  #index
  filter :title
  filter :description
  filter :name
  filter :data_source_id, :label => "Source de donn&eacute;es",
                    :as => :select

  index do
    id_column
    column "Titre", :title
    column "Source", :sortable => :data_source_id do |g|
      div link_to g.data_source.name, admin_data_source_path(g.data_source) if g.data_source
    end
    column "Information" do |l|
     div do
      b "Description :"
      span l.description
     end
      div do
        b "Wms Url :"
        span l.wms_url
      end
      div do
        b "Nom wms"
        span l.name
      end
     div link_to "Code", get_javascript_admin_layer_path(l), :class => "modal"
    end
    default_actions
  end
end
