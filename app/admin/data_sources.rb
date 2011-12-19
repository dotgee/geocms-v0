ActiveAdmin.register DataSource do
  config.clear_sidebar_sections!
  index do 
    id_column
    column :logo do |d|
      image_tag d.logo_url unless d.logo.nil?
    end
    column :name
    column :urls do |d|
      [:wms_url, :wfs_url, :csw_url, :ogc_url].each do |url|
        div do
          b url.to_s.upcase
          span d.send(url)
        end
      end
    end
    default_actions
  end
  form do |f|
    f.inputs do 
      f.input :name
      f.input :csw_url
      f.input :wms_url
      f.input :ogc_url
      f.input :wfs_url
      f.input :logo
      f.input :contact
      f.input :conditions
      f.input :credits
    end
    f.buttons do 
      f.submit
    end
  end
  
end
