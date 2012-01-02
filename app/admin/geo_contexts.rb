ActiveAdmin.register GeoContext do
  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
  filter :name, :label => "Nom context"
  filter :description
  filter :taxon, :label => "Classement"
  form do |f|
    f.inputs do 
      f.input :name
      f.input :taxon
      f.input :wmc
      f.input :description
      f.input :wmc_name
      f.input :keywords
    end
    f.buttons do 
      f.submit
    end
  end
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
    column :description do |g|
      truncate(g.description, :length => 200)
    end
    default_actions

    end
end
