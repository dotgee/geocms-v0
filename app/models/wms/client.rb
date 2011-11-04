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
      parsed_layers = capabilities_doc.xpath('//xmlns:Layer[@queryable="1"]').inject([]) do |array, l|
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
    attr_accessor :title, :name, :wms_url, :metadata_url, :legend
    class << self
      def new_default(options = {})
      
      end

      def from_xml(xml)
        layer = Layer.new
        title = xml.xpath('./xmlns:Title').text
        name = xml.xpath('./xmlns:Name').text
        metadata_url = xml.xpath('./xmlns:MetadataURL/xmlns:OnlineResource').first
        legend = xml.xpath('.//xmlns:LegendURL').first
        layer.title = title
        layer.name = name 
        layer.metadata_url = metadata_url.nil? ? nil : metadata_url.attr('href')
        layer.legend = Legend.from_xml(legend) if legend
        layer
      end
    end
  end

  class Legend
      attr_accessor :width, :height, :resource, :format
    class << self
      def from_xml(xml)
        legend = Legend.new
        legend.width = xml.attr('width')
        legend.height = xml.attr('height')
        legend.resource = xml.xpath('./xmlns:OnlineResource').attr('href').text
        legend.format = xml.xpath('./xmlns:Format').text
        legend
      end
    end
  end
end
