require 'ostruct'
require 'yaml'


config_file = YAML.load_file("#{Rails.root}/config/app.yml") || {}
app_config = config_file['common'] || {}
app_config.update(config_file[Rails.env] || {})

AppConfig = OpenStruct.new(app_config)
