ActiveAdmin.register Taxon do
  filter :name
  controller do
    
  def end_of_association_chain
    if action_name == "index"
      #return Taxon.order('lft,rgt asc').only_themes
      return Taxon.find('themes').descendants
    end
    return super
  end

  end

  form do |f|
    f.inputs "Classement" do 
      f.inputs :name
      f.inputs :parent
    end
    f.buttons
  end

  index do
    column :id
    column :name
    column "Action" do |t|
      unless t.left_sibling.nil?
        span link_to "Remonter", move_up_admin_taxon_path(t)
      end
      unless t.right_sibling.nil?
        span link_to "Descendre", move_down_admin_taxon_path(t) 
      end
    end
    default_actions

  end

  member_action :move_down do
    @taxon = Taxon.find(params[:id])
    @taxon.move_right
    redirect_to admin_taxons_path

  end
  member_action :move_up do
    @taxon = Taxon.find(params[:id])
    @taxon.move_left
    redirect_to admin_taxons_path

  end


  
end
