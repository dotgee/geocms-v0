ActiveAdmin.register Page do
  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
   form :partial => "admin/pages/form"

   index do 
    id_column
    column "Titre", :title, :class => "nowrap" 
    column "Contenu" do |p| 
      truncate(p.content, {:length => 150})
    end
    default_actions
   end
  
end
