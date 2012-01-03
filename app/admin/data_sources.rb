ActiveAdmin.register DataSource do
  controller.authorize_resource
  config.clear_sidebar_sections!
  controller do
    @@time = nil
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end

    def time
      return @@time if @@time
      seconds = 30.minutes
      @@time =  Time.at((Time.now.to_f / seconds).round * seconds)
      @@time 
    end

    def metadata_to_layer(meta)
      attr = meta.attributes
      attr.delete(:source)
      attr[:metadata_url] = [@data_source.csw_url,["uuid", attr.delete(:identifier)].join('=')].join('?')
      attr[:imported_at] = time
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
    @search.search(:max => 20, :start => (params[:page].to_i * 20) ) 
    @metadatas = @search.metadatas
    @results = Kaminari.paginate_array(@metadatas, { :total_count => @search.result[:total] }).page(params[:page] || 1).per(20)
    @existing_layers = Layer.where(:name => @metadatas.map(&:layer_name)).select(:name).map(&:name)
  end

  member_action :import, :method => :post do 
    @@time = nil
    @data_source = DataSource.find(params[:id])
    client = Csw::Client.new(@data_source.csw_url)
    layer = metadata_to_layer(client.getById(params[:identifier]))
    render :layout => false, :text => "imported"
  end

  member_action :mass_import, :method => :post do
    @@time = nil
    @data_source = DataSource.find(params[:id])
    layers_to_import = params[:import][:layer_name] || []
    client = Csw::Client.new(@data_source.csw_url)
    @imported = layers_to_import.inject([]) do |arr, uuid|
      arr << metadata_to_layer(client.getById(uuid))
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
    column :name
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
