ActiveAdmin.register Filter do
  menu :parent => "Classements"
  controller.authorize_resource
  config.clear_sidebar_sections!
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
  
end
