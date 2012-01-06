ActiveAdmin.register Page do
  config.clear_sidebar_sections!
  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
   collection_action :list_pages do
     @pages = Page.all( :select =>  "slug, title")
     render :json => @pages.to_json
   end
   form :partial => "admin/pages/form"

   index do 
    id_column
    column "Titre", :title, :class => "nowrap" 
    column "Contenu" do |p| 
      div :class => "page_content" do 
        p.content.html_safe
      end
    end
    default_actions
   end

  show do
    h3 "#{page.title } : #{page.slug}"
    hr
    div page.content.html_safe
  end
  
end
