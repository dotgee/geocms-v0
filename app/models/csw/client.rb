require 'open-uri'
require 'nokogiri'

module Csw
  class Client
    attr_accessor :csw_url, :geo_identifier, :server_url, :metadatas, :result

    def initialize(url)
      @server_url = url
      @server_url.chop! unless url.match(/\/$/).nil?
      if url.match(/csw(\/)?$/).nil?
        @csw_url = [@server_url, "srv/en/csw"].join("/")
      else
        @csw_url = @server_url
      end
    end
    
    
    def capabilities
      uri = [ @csw_url, self.class.build_capabilities_query ].join('?')
      response = open(uri).read
      return parse_response(response)
    end

    def records(options = {})
      params = {
        :request => "GetRecords" ,
        :typeNames => "csw:Record",
        :constraintLanguage => "FILTER"
      }.merge('params')
      uri = [ @csw_url, self.class.build_capabilities_query(params)].join('?')
      response = open(uri).read 
      return parse_records(response)
    end

    def parse_records(response)
      doc = Nokogiri::XML(response)
      return doc
    end

    def getById(id = nil)
      id ||= geo_identifier

      params = {
        :request => "GetRecordById",
        :elementSetName => "full",
        :id => id
      }
      uri = [ @csw_url, self.class.build_capabilities_query(params)].join('?')
      response = parse_response(open(uri).read)
      response = response.xpath('//Record').first
      return Csw::Metadata.from_xml(response)

    end

    def record_doc
      @record_doc if @record_doc
      @record_doc = getById
      @record_doc
    end

    def parse_response(response)
      doc = Nokogiri::XML(response)
      doc.remove_namespaces!
      doc

    end

    def parse_layers

    end

    def layers
      
      return @layers if @layers
      #@layers = capabilities.inspec
      @layers
    end

    def search( options = {})
      c = Curl::Easy.new(@server_url)
      c.headers = {'Content-Type' => "text/xml"}
      base_start = Mustache.render(%q(
       <csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2" xmlns:ogc="http://www.opengis.net/ogc" xmlns:ows="http://www.opengis.net/ows" xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" service="CSW" version="2.0.2" maxRecords="{{max}}" startPosition="{{start}}" outputFormat="application/xml" outputSchema="http://www.opengis.net/cat/csw/2.0.2" resultType="results">
            <csw:Query typeNames="csw:Record">
            <csw:ElementSetName>full</csw:ElementSetName> 
      ), :max => options[:max] || 1000, :start => options[:start] > 0 ? options[:start] : 1)
      constraint = %q(
            <csw:Constraint version="1.1.0">
            <ogc:Filter xmlns="http://www.opengis.net/ogc"><ogc:PropertyIsLike escape="\" singleChar="_" wildCard="%">
            <ogc:PropertyName>any</ogc:PropertyName>
            <ogc:Literal>%{{search_term}}%</ogc:Literal>
            </ogc:PropertyIsLike>
            </ogc:Filter>
            </csw:Constraint>
      )
      sort = %q(
            <ogc:SortBy>
              <ogc:SortProperty>
                <ogc:PropertyName>{{property}}</ogc:PropertyName>
                <ogc:SortOrder>{{order}}</ogc:SortOrder>
                </ogc:SortProperty>
            </ogc:SortBy>
            )
      base_end = %q(
            </csw:Query>
            </csw:GetRecords>)
      data = [base_start]
      data << Mustache.render(constraint, :search_term => options[:search_term]) unless options[:search_term].nil?
      data << Mustache.render(sort, :property => options[:property] || 'title', :order => options[:order] || 'asc')
      data << base_end

      c.post_body = data.join('')
      c.perform
      @search_result = parse_search(c.body_str)
      return @search_result
    end

    def parse_search(response)
      doc = Nokogiri::XML(response)
      doc.remove_namespaces!
      @metadatas = doc.xpath('//Record').inject([]) do |a, r|
        a << Csw::Metadata.from_xml(r)
        a
      end
      @result = {
        :next => 0,
        :per_page => 25,
        :total => 0
      }
      res = doc.xpath('//SearchResults').first
      if res
        @result[:next] = res.attr('nextRecord').to_i
        @result[:per_page] = res.attr('numberOfRecordsReturned').to_i
        @result[:total] = res.attr('numberOfRecordsMatched').to_i
     end 
    end

    def for_layer
      record = record_doc.xpath('//Record').first
      meta = Csw::Metadata.from_xml(record)
      attributes = {}
      unless record.nil?
        attributes["description"] = record.xpath('./abstract', ).map(&:text).first
        attributes["title"] = record.xpath('./title').map(&:text).first
        wms = record.xpath('./URI[starts-with(@protocol,"OGC")]').first
        attributes["name"] = wms.attr('name') if wms 
        attributes["wms_url"] = wms.text if wms 
        attributes["source"] = record.xpath('./source').map{|el| el.text}.first
        attributes["rights"] = meta.rights
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
      def record_to_layer(record)
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

  class Metadata
    attr_accessor :identifier, :description, :title, :tag_list, :type, :rights, :source, :layer
    def attributes
      return  [ :identifier, :description, :title, :tag_list, :rights, :source].inject({}) do |a, v|
        a[v] = self.send(v)
        a
      end.merge( @layer.to_layer).select{|k,v| !v.blank?}
    end

    def layer_name
      return layer.name unless layer.nil?
      return ""
    end
    class << self
      def new_default(options = {})
      end

      def from_xml(xml)
        meta = self.new
        meta.identifier = xml.xpath('./identifier').map(&:text).first 
        meta.title = xml.xpath('./title').map(&:text).first 
        meta.description = xml.xpath('./abstract').map(&:text).first 
        meta.tag_list = xml.xpath('./subject').map(&:text).join(', ')
        meta.type = xml.xpath('./type').map(&:text).first 
        meta.rights = xml.xpath('./rights').map(&:text).join('-')
        meta.source = xml.xpath('./source').map(&:text).first 
        meta.layer = Layer.new_from_xml xml.xpath('./URI[starts-with(@protocol,"OGC")]').first
        meta
      end
    end
  end

  class Layer
    attr_accessor :name, :description, :url
    def to_layer
      return {
        :name => @name,
        :wms_url => @url,
        :description => @description
      }
    end

    class << self
      def new_from_xml(xml)
        l = self.new
        return l if xml.nil?
        l.name = xml.attr('name')
        l.description = xml.attr('description')
        l.url = xml.text
        l
      end
    end
  end
end
