ActiveAdmin.register Taxon do
  index do
    column :id
    column :name
    column "Parent", :parent do |p|
      link_to p.name, admin_taxon_path(p) unless p.nil?
    end

    default_actions

  end
  
end
