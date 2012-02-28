ActiveAdmin.register GeoServer do
  menu false
  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
  filter :name
  
end
