require 'open-uri'
require 'nokogiri'

module WFS
  class Client
    include Georesource::Tools
    attr_accessor :url

    def initialize(url)
      @url = url
    end

    def getCapabilitites
      params = {
        :request => "GetCapabilities",
        :service => "wfs"
      }
      uri = [@url, to_params(params)].join('?')
      return open(uri).read
    end

  end
end
