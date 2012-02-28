module ApplicationHelper
  include ActsAsTaggableOn::TagsHelper

  def multiselect_files
    content_for :javascripts do
      javascript_include_tag 'jquery/jquery.multiselect.min.js', 'jquery/multiselectInit'
    end
    content_for :stylesheets do
      stylesheet_link_tag 'jquery/jquery.multiselect.css'
    end
  end

  def map_js
    content_for :javascripts do
      javascript_include_tag "openLayersEssentials"
    end
  end

  def title
    return @title if @title
    return "Bretagne Environnement"
  end

  def title=(title)
    @title = title
  end

  def input_popover(title,options = {}, &block)
    arrow_side = options.delete(:arrow_side) || "right"
    capture_haml do
      haml_tag(:div, :class => "popover #{arrow_side}") do 
        haml_tag(:div, :class => 'arrow')
        haml_tag(:div, :class => 'inner') do
          haml_tag(:h3, :class => "title") do
            haml_concat title
          end
          haml_tag(:div, :class => "content") do
            yield
          end
        end
      end
    end
  end
  def title_bootstrap(&block)
    content_for :header do
      yield
    end
  end

  def bootstrap_form_for(object, *args, &block)
    options = args.extract_options!
    simple_form_for(object, *(args << options.merge(:builder => SimpleBootstrapFormBuilder)), &block)
  end

end

