require 'open-uri'
require 'nokogiri'

module Csw
  class Client
    attr_accessor :csw_url, :geo_identifier, :server_url

    def initialize(url)
      @server_url = url
      @server_url.chop! unless url.match(/\/$/).nil?
      @csw_url = [@server_url, "srv/en/csw"].join("/")
    end
    
    
    def capabilities
      uri = [ @csw_url, self.class.build_capabilities_query ].join('?')
      response = open(uri).read
      return parse_response(response)
    end

    def records
      params = {
        :request => "GetRecords" ,
        :constraint => "%"
      }
      uri = [ @csw_url, self.class.build_capabilities_query()].join('?')
      response = open(uri).read 
    end

    def getById(id = nil)
      id ||= geo_identifier
      params = {
        :request => "GetRecordById",
        :elementSetName => "full",
        :id => id
      }
      uri = [ @csw_url, self.class.build_capabilities_query(params)].join('?')
      puts uri
      response = open(uri).read
      return parse_response(response)
    end

    def parse_response(response)
      puts response
      Nokogiri::XML(response)
    end
    
    class << self
      include Georesource::Tools
      
      def from_layer(layer)
        client = self.new(layer.csw_url)
        client.geo_identifier = layer.geonetwork_identifier
        client
      end

      def build_capabilities_query(options = {} )
        params = {
          :request => 'GetCapabilities',
          :service => 'CSW'
        }.merge(options)
        return to_params(params)
      end
    end

  end
end
