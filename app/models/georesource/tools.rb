module Georesource
  module Tools
    def from_params(params, key ="uuid")
      new_params = CGI::parse(params)
      id = new_params.detect{|k,v| k == key }
      id.last.first unless id.nil?
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
