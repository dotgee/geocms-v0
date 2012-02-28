module GeoContextsHelper

  def insert_script(script_name, options)
    %Q(
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '#{root_url}#{ full_path_for_javascript(script_name) }';
      document.getElementsByTagName('head')[0].appendChild(script);
      delete script;
    )
      
  end

  def full_path_for_javascript(javascript)
    return javascript_path(javascript)
  end

  def insert_geocontext_datas(geo_context)
    %Q(
    document.write("<scr"+"ipt type='text/javascript' >");
    document.write("</scr"+"ipt>");
      ).html_safe
  end
end
