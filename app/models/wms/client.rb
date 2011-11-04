require 'open-uri'
require 'nokogiri'

module WMS
  class Client
    def initialize(url)
      @wmsurl = url
      @capabilities_doc = nil
    end


    def capabilities
      uri = [ @wmsurl, self.class.build_capabilities_query ].join('?')
      response = open(uri).read
      return parse_response(response)
    end

    def parse_response(response)
      Nokogiri::XML(response)
    end
    
    def capabilities_doc
      return @capabilities_doc if @capabilities_doc
      @capabilities_doc = capabilities
      @capabilities_doc
    end

    def layers
      parsed_layers = capabilities_doc.xpath('//xmlns:Layer').inject([]) do |array, l|
        array << Layer.from_xml(l)
        array
      end
      parsed_layers
    end

    class << self
      def build_capabilities_query
        params = {
          :request => 'GetCapabilities',
          :service => 'WMS',
        }
        
        return to_params(params)
      end

      def to_params(h)
        params = ''
        stack = []

        h.each do |k, v|
          if v.is_a?(Hash)
            stack << [k,v]
          else
            params << "#{k}=#{v}&"
          end
        end

        stack.each do |parent, hash|
          hash.each do |k, v|
            if v.is_a?(Hash)
              stack << ["#{parent}[#{k}]", v]
            else
              params << "#{parent}[#{k}]=#{v}&"
            end
          end
        end

        params.chop! # trailing &
        params
      end
    end
  end

  class Layer
    attr_accessor :title, :name, :wms_url
    class << self
      def new_default(options = {})
      
      end

      def from_xml(xml)
        layer = Layer.new
        title = xml.xpath('./xmlns:Title').text
        name = xml.xpath('./xmlns:Name').text
        layer.title = title
        layer.name = name 
        layer
      end
    end
  end
end
