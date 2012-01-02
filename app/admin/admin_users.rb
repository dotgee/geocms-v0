ActiveAdmin.register AdminUser do
  menu :if => proc { current_admin_user.role?('super_admin')}
  controller.authorize_resource
  controller do
    def current_ability
      @current_ability ||= AdminAbility.new(current_admin_user)
    end
  end

  filter :email
  form do |f|
    f.inputs do 
      f.input :last_name
      f.input :first_name
      f.input :email
      if f.object.new_record?
        f.input :password
        f.input :password_confirmation 
      end
      f.input :role
    end
    f.buttons do
      f.submit
    end
  end
  index do
    column :id
    column "Email", :email
    column "Nombre de connexion", :sign_in_count
    default_actions
  end
end
