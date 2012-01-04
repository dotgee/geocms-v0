require 'open-uri'
require 'nokogiri'

module WMS
  class Client
    def initialize(url, options = {})
      @wmsurl = url
      @layer_name = options.delete(:layer_name)
      @capabilities_doc = nil
      @features_doc = features_doc
    end

    def capabilities
      uri = [ @wmsurl, self.class.build_capabilities_query ].join('?')
      perform(uri)
    end

    def features
      uri = [ @wmsurl, self.class.build_features_query(@layer_name) ].join('?')
      perform(uri)
    end

    def perform(uri)
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

    def features_doc
      return @features_doc if @features_doc
      @features_doc = features
      @features_doc
    end

    def layers
      parsed_layers = capabilities_doc.xpath('//xmlns:Layer[@queryable="1"]').inject([]) do |array, l|
        layer = Layer.from_xml(l)
        layer.wms_url = @wmsurl
        array << layer
        array
      end
      parsed_layers
    end

    def features_list
      f = features_doc.remove_namespaces!
      parsed_features = f.xpath('//sequence/element').inject([]) do |array, l|
        array << [l["name"]]
        array
      end
      parsed_features.delete_at(0)
      parsed_features
    end

    class << self
      include Georesource::Tools

      def build_capabilities_query
        params = {
          :request => 'GetCapabilities',
          :service => 'WMS',
        }
        
        return to_params(params)
      end

      def build_features_query(layer_name)
        params = {
          :request => 'DescribeFeatureType',
          :service => 'WFS',
          :typeName => layer_name
        }
        return to_params(params)
      end  

    end
  end

  class Layer
    attr_accessor :title, :name, :wms_url, :metadata_identifier, :metadata_url, :legend, :description, :tag_list
    class << self
      def new_default(options = {})
      
      end

      def from_xml(xml)
        layer = Layer.new
        title = xml.xpath('./xmlns:Title').text
        name = xml.xpath('./xmlns:Name').text
        description = xml.xpath('./xmlns:Abstract').text
        metadata_url = xml.xpath('./xmlns:MetadataURL/xmlns:OnlineResource').first
        legend = xml.xpath('.//xmlns:LegendURL').first
        layer.tag_list = xml.xpath('./xmlns:KeywordList/xmlns:Keyword').map(&:text).select{|t| !t.blank? }.join(', ')
        layer.title = title
        layer.name = name 
        url, identifier = metadata_url.attr('href').split('?') unless metadata_url.nil?
        layer.metadata_url = url || nil
        layer.metadata_identifier = identifier.split('=').last unless identifier.nil?
        layer.legend = Legend.from_xml(legend) if legend
        layer.description = description
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
