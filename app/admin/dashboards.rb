ActiveAdmin::Dashboards.build do

  # Define your dashboard sections here. Each block will be
  # rendered on the dashboard in the context of the view. So just
  # return the content which you would like to display.
  
  # == Simple Dashboard Section
  # Here is an example of a simple dashboard section
  #
     section "Recent Layers" do
       ul do
         Layer.recent_published.limit(5).collect do |layer|
           li link_to(layer.title, layer)
         end
       end
     end

     #section "Actions" do
     #   span link_to "Import de couche", import_admin_layers_path, :class => 'btn primary'
     #   span link_to "Moissonnage", import_admin_layers_path, :class => 'btn primary'
     #end
  
  # == Render Partial Section
  # The block is rendered within the context of the view, so you can
  # easily render a partial rather than build content in ruby.
  #
  #   section "Recent Posts" do
  #     div do
  #       render 'recent_posts' # => this will render /app/views/admin/dashboard/_recent_posts.html.erb
  #     end
  #   end
  
  # == Section Ordering
  # The dashboard sections are ordered by a given priority from top left to
  # bottom right. The default priority is 10. By giving a section numerically lower
  # priority it will be sorted higher. For example:
  #
  #section "Recent Layers", :priority => 1
  #   section "Recent User", :priority => 1
  #
  # Will render the "Recent Users" then the "Recent Posts" sections on the dashboard.

end
