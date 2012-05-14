atom_feed({ :language => "fr-FR"}) do |feed|
  feed.title("Cartographie dynamique des données environnementales en Bretagne".html_safe)
  feed.updated(@layers[0].last_date) if @layers.length > 0

  @layers.each do |layer|
    feed.entry(layer, { :published => (layer.publication_date || layer.created_at), :updated_at => layer.last_date}) do |entry|
      entry.title(layer.title)
      entry.content(layer.description, :type => 'html')
      entry.author do |author|
        author.name('GIPBE')
      end
    end
  end
end
