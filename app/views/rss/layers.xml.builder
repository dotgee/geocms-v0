xml.instruct! :xml, :version => "1.0" 
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "Cartographie dynamique des données environnementales en Bretagne".html_safe
    xml.description "Site de cartographie"
    xml.link layers_url
    @layers.each do |layer|
      xml.item do
        xml.title layer.title
        xml.description layer.description
        xml.pubDate layer.last_date.to_s(:rfc822)
        xml.link layer_url(layer)
        xml.guid layer_url(layer)
      end
    end
  end
end
