namespace :db do
  desc "Populate Database with default values"
  task :populate => :environment do

    puts "Add theme taxon" #for layer taxonomisation
    theme = Taxon.create!({:name => "Themes" })

    puts "Create theme fond carto"
    fonds = Taxon.new({:parent => theme, :name => "Fonds cartographiques"})
    fonds.save!

    puts "Default WMC Creation"
    wmc_file = File.new(File.join(Rails.root,"lib/tasks", "default.wmc"))
    gc = GeoContext.create!({:name => "Default WMC", :description => "Update Me"})
    gc.wmc = wmc_file
    gc.save!
    puts "Creation of Administrator" 
    AdminUser.create!({:email => "admin@example.com", 
                        :last_name => "Admin",
                        :first_name => "istrator",
                        :password => "password", 
                        :password_confirmation => "password"})
    puts "You could now access to Administration"
    puts "Admin path : /admin"
    puts "Admin login : admin@example.com"
    puts "Admin password : password"
  end

  task :remove_test_values => :environment do
    puts "Remove Taxon theme"
    theme = Taxon.find_by_slug('themes')
    if theme
      theme.children.delete_all
      theme.destroy
    end
    GeoContext.delete_all({:slug => "default-wmc" })
    AdminUser.delete_all({:email => "admin@example.com"})
  end

end
