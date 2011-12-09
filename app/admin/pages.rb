ActiveAdmin.register Page do
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
