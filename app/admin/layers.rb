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
  
end
