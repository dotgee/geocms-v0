ActiveAdmin.register GeoServer do
  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end
  filter :name
  
end
