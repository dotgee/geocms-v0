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
      response = open(uri).read
      return parse_response(response)
    end

    def record_doc
      @record_doc if @record_doc
      @record_doc = getById
      @record_doc
    end

    def parse_response(response)
      doc = Nokogiri::XML(response)
      puts response
      doc.remove_namespaces!
      doc

    end

    def for_layer
      record = record_doc.xpath('//Record').first
      attributes = {}
      unless record.nil?
        attributes["description"] = record.xpath('./abstract', ).map(&:text).first
        attributes["title"] = record.xpath('./title').map(&:text).first
        wms = record.xpath('./URI[starts-with(@protocol,"OGC")]').first
        attributes["name"] = wms.attr('name') if wms 
        attributes["wms_url"] = wms.text if wms 
        attributes["source"] = record.xpath('./source').map{|el| el.text}.first
        begin
        attributes["tag_list"] = record.xpath('./subject').map(&:text).select{|k| !k.blank?}.join(', ')
        rescue => e
          puts e.inspect
        end
      end
      return attributes.select{|k,v| !v.blank?}

    end

    class << self
      include Georesource::Tools
      def from_geonetwork_url(url)
        host, params = url.split('?')
        client = self.new(host)
        client.geo_identifier = from_params(params)
        client
      end
      
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
