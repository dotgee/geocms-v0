ActiveAdmin.register GroupProject , :alias => "Groupe de projets" do
  form :partial => "admin/group_projects/form"
  index do 
    id_column
    column "Nom", :name
    default_actions
  end
end
