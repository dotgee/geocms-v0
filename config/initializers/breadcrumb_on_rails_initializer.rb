module BreadcrumbsOnRails

  module Breadcrumbs

    class RichBreadcrumb < Builder

      def render
        @elements.collect do |element|
          render_element(element)
        end.join(@options[:separator] || " &raquo; ")
      end

      def render_element(element)
        element.options[:itemprop] = "url"
        if element.path == nil
          content = compute_name(element)
        else
          content = @context.link_to_unless_current(compute_name(element), compute_path(element), element.options)
        end
        if @options[:tag]
          @context.content_tag(@options[:tag], itemscope: "itemscope", itemtype: "http://data-vocabulary.org/Breadcrumb") do
            @context.content_tag(:span, content, itemprop: "title")
          end
        else
          content
        end
      end

    end

  end

end
