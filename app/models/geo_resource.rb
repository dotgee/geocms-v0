class GeoResource < ActiveResource::Base
  self.site = "http://admin:geoserver@geo.devel.dotgee.fr/geoserver/rest/"
  self.format = ActiveResource::Formats::JsonFormat
end
