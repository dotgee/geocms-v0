class BootstrapFormBuilder < ActionView::Helpers::FormBuilder
  attr_reader :template

  ['text_field', 'text_area', 'email_field', 'password_field', 'file_field' ].each do |helper|
    define_method helper do |field, *args|
      options = args.detect{ |a| a.is_a?(Hash) } || {}
      options[:class] ||= 'span8'
      
      if @object.errors[field].any?
        '<div class=" error">'.html_safe +
        (self.label field) +
        '<div class="input">'.html_safe +
        (super field, *args) +
        '<span class="help-inline">'.html_safe + @object.errors[field].join('; ') + '</span>'.html_safe +
        '</div></div>'.html_safe
      else
        '<div class="">'.html_safe +
        (self.label field) +
        '<div class="input">'.html_safe +
        (super field, *args) +
        '</div></div>'.html_safe
      end
      
    end
  end

  def inputs(*args, &block)
    html_options = args.extract_options!

    out = begin
      if block_given?
        field_set_wrapping(*(args << html_options), &block)
      else
        ''
      end
    end
    out
  end

  def field_set_wrapping(*args, &block)
    contents = args.last.is_a?(::Hash) ? '' : args.pop.flatten
    html_options = args.extract_options!

    if block_given?
      contents = if template.respond_to?(:is_haml?) && template.is_haml?
        template.capture_haml(&block)
      else
        template.capture(&block)
      end
    end

    contents = contents.join if contents.respond_to?(:join)
    fieldset = template.content_tag(:fieldset, contents)

    fieldset
  end
end

class SimpleBootstrapFormBuilder < SimpleForm::FormBuilder
  def input(attribute_name, options = {}, &block)
    options[:wrapper_html] ||= {}
    options[:wrapper_html].merge! :class => ''
    options[:input_html] ||= {}
    options[:input_html].reverse_merge! :class => "span8"
    super attribute_name, options
  end

  def text_field2(*args)
    template.content_tag(:div, super(*args), { :class => 'input' })
  end

  ['collection_select', 'text_field', 'text_area', 'email_field', 'password_field', 'file_field' ].each do |helper|
    define_method helper do |field, *args|
      options = args.detect{ |a| a.is_a?(Hash) } || {}
      options[:class] ||= 'span8'

      template.content_tag(:div, super(field, *args), { :class => 'input' })
    end
  end
end
