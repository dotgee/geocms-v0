ActiveAdmin.register GeoContext, :alias => I18n.t(:geo_contexts) do
  member_action :get_javascript do
    render :layout => false, :template => "geo_contexts/get_javascript"
  end

  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
  filter :name, :label => "Nom context"
  filter :description
  filter :taxon, :label => "Classement"
  form :partial => "admin/geo_contexts/form"

  index do
    column('ID', :sortable => :id){|resource| link_to resource.id, resource_path(resource), :class => "resource_id_link"}
    column "Information" do |c|
      div do
        b "Nom :"
        span c.name
      end
      div do
        b "Liste tags :"
        span c.tag_list
      end
      div link_to "Code", get_javascript_admin_geo_context_path(c), :class => "modal"
    end
    column :description do |g|
      truncate(g.description, :length => 200)
    end
    default_actions

    end
end
