ActiveAdmin.register DataSource do
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
