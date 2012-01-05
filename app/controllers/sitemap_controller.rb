class SitemapController < ApplicationController
  def sitemap
    @layers = Layer.published.all
    @pages = Page.published.all
    @taxons = Taxon.find('themes').descendants
    @tags = ActsAsTaggableOn::Tag.all
  end

end
