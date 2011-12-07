ActiveAdmin.register Layer do
  form :partial => "admin/layers/form"
  filter :title
  filter :description
  filter :name
  filter :wms_url, :label => "Serveur", :as => :select, :collection => proc { Layer.select('distinct wms_url').map(&:wms_url)}
  index do
    column "ID" do |l|
      div do 
        link_to l.send(:id), admin_layer_path(l)
      end
    end
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
 
  # @todo Faire un client WFS pour recuperer ces infos
  controller do
    def edit
      @layer = Layer.find(params[:id]) 
      c = Curl::Easy.perform("#{@layer.wms_url}?service=wfs&version=1.1.0&request=DescribeFeatureType&typeName=#{@layer.name}")
      doc = Nokogiri::XML(c.body_str)

    end
  end

end
