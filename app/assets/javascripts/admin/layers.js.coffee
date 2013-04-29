$(document).ready () ->
  $('.tabs').tab();
  $('#geoserver_check').click((e) ->
    e.preventDefault();
    datas = {
      wms_url: $('#layer_wms_url').val(),
      name: $('#layer_name').val()
    }
    $.ajax('/admin/layers/from_geoserver', {
      data: datas,
      type: 'post',
      success: (data) ->
        if is_error(data)
          return false;
        update_inputs(data);
        true
    });
  );

  $('#geonetwork_check').click((e) ->
    e.preventDefault();
    input = $('#layer_metadata_url');
    identifier = $('#layer_metadata_identifier');
    $.ajax('/admin/layers/from_geonetwork', {
      data: {
        url: input.val(),
        identifier:  identifier.val()
      },
      type: 'post',
      success: (data) ->
        if is_error(data)
          return false;
        update_inputs(data);
        true
    });
  )
  
  update_inputs = (data) ->
    $.each(data, (i,el) ->
      input = $('#layer_'+i);
      input.val(el) if input && el
    )
    success_div("Informations renseign&eacute;es").insertAfter($('.pill-content').first()).fadeIn();
    true


  is_error = (data) ->
    if data.error
      error_div(data.error).insertAfter($('.pill-content').first()).fadeIn()
      return true
    false

  $("#wait").ajaxStart(() ->
    $(this).height($(window).height()).width($(window).width());
    opts = { lines: 12, length: 6, width: 11, radius: 7, color: '#FFF', speed: 1.3, trail: 83, shadow: true };
    $("#wait").show();
    $('#wait').spin(opts);
    true
  ).ajaxStop(()-> 
    $('#wait').fadeOut("normal", ()->
      $(this).spin().stop();
    )
  
  );
  true
  
  alert_div = (text) ->
    div = $('<div />').addClass('alert-message hidden');
    div.append($('<a href="#">x</a>').addClass('close'));
    div.append($('<p />').html(text))
    div

  error_div = (text) ->
    div = alert_div(text).addClass('error')
    div

  success_div = (text) ->
    div = alert_div(text).addClass('success')
    div
    
