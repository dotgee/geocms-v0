ActiveAdmin.register AdminUser do
  filter :email
  form do |f|
    f.inputs do 
      f.input :last_name
      f.input :first_name
      f.input :email
      f.input :password
      f.input :password_confirmation
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
