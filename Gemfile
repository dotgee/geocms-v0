require 'rbconfig'
HOST_OS = Config::CONFIG['host_os']
source 'http://rubygems.org'
gem 'rails', '3.1.0'
gem 'mysql2'
group :assets do
  gem 'sass-rails', "  ~> 3.1.0"
  gem 'coffee-rails', "~> 3.1.0"
  gem 'uglifier'
end
group :test do
  
  gem 'turn', :require => false
end
if HOST_OS =~ /linux/i
  gem 'therubyracer', '>= 0.8.2'
end
gem "haml", ">= 3.1.2"
gem "haml-rails", ">= 0.3.4", :group => :development
gem "compass", "~> 0.12.alpha.0"
gem "devise", ">= 1.4.5"
gem "rails-footnotes", ">= 3.7", :group => :development
gem "jammit"
gem "omniauth", ">= 0.3.0.rc3"
gem "redis"
gem "settingslogic"
gem "rails_admin", :git => "git://github.com/sferik/rails_admin.git"
