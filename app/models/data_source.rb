class DataSource < ActiveRecord::Base
   has_attached_file :logo, :styles => { :thumb => "100x100>" }

   def logo_url
      return logo.url(:thumb) unless logo.nil?
   end
end
