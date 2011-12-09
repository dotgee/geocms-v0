ActiveAdmin.register AdminUser do
  filter :email
  index do
    column :id
    column "Email", :email
    column "Nombre de connexion", :sign_in_count
    default_actions
  end
end
