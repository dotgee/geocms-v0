ActiveAdmin.register Taxon do
  filter :name
  controller do
    
  def end_of_association_chain
    if action_name == "index"
      return Taxon.order('lft asc ,rgt asc')
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
    column :name do |t|
      #div "#{'-' * t.level}#{t.name}"
      div :class => "tab#{t.level}" do
        if t.level > 0
          span t.parent.name
          span "&rarr;".html_safe
        end

        b t.name
      end
    end
    column "Action" do |t|
      if !t.root?
        unless t.left_sibling.nil?
          span link_to "Remonter", move_up_admin_taxon_path(t)
        end
        unless t.right_sibling.nil?
          span link_to "Descendre", move_down_admin_taxon_path(t) 
        end
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
