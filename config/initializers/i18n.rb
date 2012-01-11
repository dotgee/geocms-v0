if ['0.6.0'].include?(I18n::VERSION) && Rails.env == "development"

  module I18n
    module Backend
      class Simple
        # Monkey-patch-in localization debugging.. ( see: http://www.unixgods.org/~tilo/Rails/which_l10n_strings_is_rails_trying_to_lookup.html )
        # Enable with ENV['I18N_DEBUG']=1 on the command line in server startup, or ./config/environments/*.rb file.
        #
        def lookup(locale, key, scope = [], options = {})
          init_translations unless initialized?
          keys = I18n.normalize_keys(locale, key, scope, options[:separator])

          puts "I18N keys: #{keys}"
          regexp = //
         # res = ""
         #caller.each_with_index{|x,i| 
          #We'll took only items containing Rails.root and we are not interested in current stack position, so skip i == 0
         #   res << "#{ '#'+i.to_s}:\t#{ x.sub(regexp,'') }\n" if x =~ regexp && i != 0 
         # }
         # puts res
          keys.inject(translations) do |result, _key|
            _key = _key.to_sym
            return nil unless result.is_a?(Hash) && result.has_key?(_key)
            result = result[_key]
            result = resolve(locale, _key, result, options.merge(:scope => nil)) if result.is_a?(Symbol)

            puts "\t\t => " + result.to_s + "\n" if ENV['I18N_DEBUG'] && (result.class == String)

            result
          end
        end
      end
    end
  end
end
