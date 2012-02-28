ActiveAdmin.register DataSource, :alias => I18n.t(:data_source)  do
  controller.authorize_resource
  config.clear_sidebar_sections!
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end

    def time
      seconds = 30.minutes
      return  Time.at((Time.now.to_f / seconds).round * seconds)
    end

    def metadata_to_layer(meta, time_import)
      attr = meta.attributes
      attr.delete(:source)
      attr[:metadata_url] = @data_source.csw_url
      attr[:metadata_identifier] =  attr.delete(:metadata_identifier)
      attr[:imported_at] = time_import
      attr[:wms_url] = @data_source.wms_url if attr[:wms_url].blank?
      l = Layer.new(attr)
      existing_layer = Layer.where(:name => l.name)
      if existing_layer.any?
        existing_layer.first.update_attributes(attr)
      else
        l.save
      end
      return existing_layer.first || l
    end
  end

  member_action :list_capabilities do
    @data_source = DataSource.find(params[:id])
    @search =  Csw::Client.new(@data_source.csw_url)
    options = { :max => 20, :start => (params[:page].to_i * 20)}
    options.merge!( :search_term => @data_source.wms_url) if params[:wms_filter]
    @search.search(options)
    @metadatas = @search.metadatas
    @results = Kaminari.paginate_array(@metadatas, { :total_count => @search.result[:total] }).page(params[:page] || 1).per(20)
    @existing_layers = Layer.where(:name => @metadatas.map(&:layer_name)).select(:name).map(&:name)
  end

  member_action :import, :method => :post do 
    @time = time
    @data_source = DataSource.find(params[:id])
    client = Csw::Client.new(@data_source.csw_url)
    layer = metadata_to_layer(client.getById(params[:metadata_identifier]), @time)
    if layer.valid?
      rep = { :valid => "imported" }
    else
      rep = { :errors => layer.errors.messages}
    end
    render :layout => false, :json => rep
  end

  member_action :mass_import, :method => :post do
    @time = time
    @data_source = DataSource.find(params[:id])
    layers_to_import = params[:import][:layer_name] || []
    client = Csw::Client.new(@data_source.csw_url)
    @imported = layers_to_import.inject([]) do |arr, uuid|
      arr << metadata_to_layer(client.getById(uuid), @time)
      arr
    end
    flash[:notice] = "#{@imported.length} couches importees"
    redirect_to url_for({ :controller => "admin/data_sources", :id => params[:id], :page => params[:page], :action => :list_capabilities})
  end


  index do 
    id_column
    column :logo do |d|
      image_tag d.logo_url unless d.logo.nil?
    end
    column :name do |d|
      div d.name
      div link_to "Import", list_capabilities_admin_data_source_path(d)
    end
    
    column :urls do |d|
      [:wms_url, :wfs_url, :csw_url, :ogc_url].each do |url|
        div do
          b url.to_s.upcase
          span d.send(url)
        end
      end
    end
    default_actions
  end

  form do |f|
    f.inputs do 
      f.input :name
      f.input :csw_url
      f.input :wms_url
      f.input :ogc_url
      f.input :wfs_url
      f.input :logo
      f.input :contact
      f.input :conditions
      f.input :credits
    end
    f.buttons do 
      f.submit
    end
  end
  
end
