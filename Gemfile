require 'rbconfig'
HOST_OS = RbConfig::CONFIG['host_os']
source 'http://rubygems.org'
gem 'rails'
gem 'mysql2'
group :assets do
  gem 'coffee-rails'
  gem 'uglifier'
end
  gem 'compass_twitter_bootstrap'
  gem "compass", "~> 0.12.alpha.0", :group => :development
group :test do
  
  gem 'turn', :require => false
end
if HOST_OS =~ /linux/i
  gem 'therubyracer', '>= 0.8.2'
end

gem "haml"
gem "haml-rails"
gem "sass"
gem 'sass-rails'
gem "nokogiri"
gem "devise"
#gem "rails-footnotes", ">= 3.7.5", :group => :development
gem "jammit"
#gem "omniauth", ">= 0.3.0.rc3"
gem "settingslogic"
gem 'acts-as-taggable-on', '~>2.2.0'
gem 'show_for'
gem 'paperclip', '~> 2.4'
gem 'friendly_id', '~> 4.0.0.beta8'
gem 'awesome_nested_set'
gem 'unicorn'
gem 'jquery-rails'
gem 'simple_form'
gem 'nestful'
gem 'cancan'
gem 'kaminari'
gem 'sunspot_with_kaminari'

#gem 'comfortable_mexican_sofa' #cms engine
gem 'slim' 

gem 'redis', "~> 2.2.0"
gem "uuid", "~> 2.3.4"
gem 'activeadmin', :path => 'vendor/git/active_admin'# , :git => "git://github.com/gregbell/active_admin.git"#">= 0.3.4"
gem "meta_search" #    '>= 1.1.0.pre'
#recherche solR
gem "sunspot"
gem "sunspot_solr"
gem "sunspot_rails"

gem "mustache"
gem "ckeditor", "3.7.0.rc1"#, :path => "vendor/git/ckeditor"
#, :git => "git://github.com/pshoukry/ckeditor.git"
gem "curb"

gem "acts_as_list"

gem 'rails-translate-routes'
gem 'rmagick'

# gem 'gd2'
gem "rack"
gem 'meta-tags', :require => 'meta_tags'
gem "formtastic"

gem "breadcrumbs_on_rails"
