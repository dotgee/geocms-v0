require 'rbconfig'
HOST_OS = RbConfig::CONFIG['host_os']

source 'http://rubygems.org'

gem 'rails'
gem 'mysql2'

group :assets do
  gem 'coffee-rails', "~> 3.1.0"
  gem 'uglifier'
  #gem 'compass_twitter_bootstrap'
  #gem "compass", "~> 0.12.alpha.0", :group => :development
end

group :test do
  gem 'turn', :require => false
end

if HOST_OS =~ /linux/i
  gem 'therubyracer', '>= 0.8.2'
end

gem "haml", ">= 3.1.2"
gem "haml-rails", ">= 0.3.4"
gem "sass"
gem 'sass-rails', "  ~> 3.1.0"
gem "nokogiri"
gem "devise", ">= 1.4.5"
gem "jammit"

gem 'acts-as-taggable-on', '~>2.2.0'
gem 'paperclip', '~> 2.4'
gem 'friendly_id', '~> 4.0.0.beta8'
gem 'awesome_nested_set'
gem 'unicorn'
gem 'nestful'
gem 'cancan'
gem 'kaminari'
gem 'sunspot_with_kaminari'

gem 'redis', "~> 2.2.0"
gem "uuid", "~> 2.3.4"
gem 'activeadmin'
gem "meta_search"

#recherche solR
#gem "sunspot"
#gem "sunspot_solr"
#gem "sunspot_rails"

gem "mustache"
gem "ckeditor", "3.7.0.rc3"
gem "curb"

gem "acts_as_list"

gem 'rails-translate-routes'
#gem 'rmagick'

gem "gon"
