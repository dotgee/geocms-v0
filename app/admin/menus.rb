ActiveAdmin.register Menu do
  show do
    render "admin/menus/show"
  end 

  member_action :move_lower do
    @page = Page.find(params[:page_id])
    @page.move_lower
    @page.update_attribute(:published, true)
    redirect_to admin_menu_path(params[:id])
  end

  member_action :move_higher do
    @page = Page.find(params[:page_id])
    @page.move_higher
    redirect_to admin_menu_path(params[:id])
  end
end
