class DatetimeInput < Formtastic::Inputs::DatetimeInput
  def to_html
      input_wrapping do
        label_html <<

        builder.hidden_field(method, datetimeperso_html_options(object.send(method)))<<
        builder.text_field(method,{:class => "uidatetimepicker", 
                                    :value => value_for_text(object.send(method)),
                                    :name => "#{method}" 
                                    })
      end
  end  

  def datetimeperso_html_options(value = nil)
    id = "#{input_html_options[:id]}_hidden"
    input_html_options.merge({:id => id})
  end

  def value_for_text(value = nil)
    return "" unless value
    return value.strftime('%d/%m/%Y')
  end
end
