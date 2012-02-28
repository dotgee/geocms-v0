class Menu < ActiveRecord::Base
   extend FriendlyId
   friendly_id :title, :use => :slugged 
   has_many :pages, :order => "position asc"
end
