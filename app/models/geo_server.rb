class GeoServer < ActiveRecord::Base
  BZH_BOUNDING_BOX = "-222798.0968333,6704730.534021,757736.1018333,6904689.799979"
  validates :name, 
            :presence => true
  validates :url,
            :presence => true,
            :format => {
              :with => /(^$)|(^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$)/ix
            }
  has_many :layers

  def layer_thumbnail_url(layer, options = {})
    thumb_url = "#{url}/wms"
    layers = [background_default_name, layer.name].join(',')
    params = {
      "LAYERS" => layers,
      "FORMAT" => CGI::escape("image/png"),
      "SERVICE" => "WMS",
      "VERSION" => "1.1.1",
      "REQUEST" => "GetMap",
      "STYLES" => "",
      "SRS" => CGI::escape("EPSG:2154"),
      "BBOX" => BZH_BOUNDING_BOX,
      "WIDTH" => "200",
      "HEIGHT" => "60"
    }.merge(options).to_a.map{|k,v| "#{k}=#{v}"}.join('&')

    return [thumb_url, params].join('?')
    
  end
end
