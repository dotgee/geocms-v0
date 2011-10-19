class Datastore < GeoResource
  self.site = "#{self.site}workspaces/:workspace_name/"
  self.element_name = "dataStore"

  class << self
    alias_method :find_with_from, :find
    def find(*args)
        options = args.extract_options!
        options[:from] = collection_path(options[:params]).gsub(self.element_name, self.element_name.downcase)
        find_with_from(args.slice(0), options)
    end
  end
end
