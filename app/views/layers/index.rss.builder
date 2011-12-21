xml.instruct! :xml, :version => "1.0" 
xml.rss :version => "2.0" do
  xml.channel do
    xml.title ""
    xml.description "A blog about software and chocolate"
    xml.link layers_url

    @layers.each do |layer|
      xml.item do
        xml.title layer.title
        xml.description layer.description
        xml.pubDate layer.modification_date
        xml.guid layer_url(layer)
      end
    end
  end
end
