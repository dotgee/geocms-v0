ActiveAdmin.register GeoContext do
  filter :name, :label => "Nom context"
  filter :description
  filter :taxon, :label => "Classement"
  index do
    column('ID', :sortable => :id){|resource| link_to resource.id, resource_path(resource), :class => "resource_id_link"}
    column "Information" do |c|
      div do
        b "Nom :"
        c.name
      end
      div do
        b "Liste tags :"
        c.tag_list
      end
      div do
      end
      div do
      end
    end
    column :description
    default_actions

    end
end
