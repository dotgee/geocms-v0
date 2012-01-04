//=# require active_admin/base
//= require jquery
//= require jqueryui
//= require rails
//= require pure
//= require jquery/jquery.multiselect.js
//= require bootstrap
//= require j.autoresize
//= require admin/layers
//= require timepicker

$(function(){
  $(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});
  $('textarea').height(100).autoResize({});
    $(".clear_filters_btn").click(function(){
        window.location.search = "";
            return false;
              });
              });

$(document).ready(function(){
 
  $('.uidatetimepicker').each(function(i,el){
    $(el).datepicker({
      altField: $(el).prev('input') ,
      //timeFormat: 'hh:mm',
      dateFormat: 'dd/mm/yy', 
      altFormat: 'yy-mm-dd 12:00:00 UTC'
    });
  });
  $('select[multiple=multiple]').multiselect({});
  $('.alert-message .close').live('click', function(e){
    e.preventDefault();
    var parent = $(this).parent();
    parent.slideUp( function(){ parent.remove(); });
  });
  $('#check_all').click(function(e){
    var others = $(this).parents('table').first().find('input[type=checkbox]');
    var checked = $(this).is(':checked');
    others.each(function(i,el){
      $(el).prop('checked', checked);
    });

  });
  
  $('.modal').click(function(e){
    e.preventDefault();
    if($('#modal_export').length == 0){
      var div = $('<div id="modal_export"><pre></pre></div>');
      div.appendTo($('body'));
      $('#modal_export').dialog({
       title: 'Copier et coller le code dans la page d\351sir\351e', 
       width: 500,
        buttons: {
          Ok: function(){
            $( this ).dialog( "close" );
          }
        }
      });
    }
    var modal = $('#modal_export');
    modal.find('pre').first().load($(this).attr('href'), function(){
      modal.dialog('open');
    
    });
  });

  $('.import_layer').click(function(e){
    e.preventDefault();
    var link = $(this);
    $.ajax(link.attr('href'),
        {
          type: 'post',
          success: function(data){
            var tr = link.parents('tr').first()
            tr.effect('highlight', 500);  
            if(data.valid){
              tr.find('.label_boot').first().addClass('success').removeClass('warning').html(' Pr&eacute;sente');
              link.remove();
            }
            else{
              var text = $.map(data.errors, function(n,i){
                return i + " "+data.errors[i]; 
              });
              tr.find('.label_boot').first().addClass('important').removeClass('warning').html('Erreur');
            }
          },

    });
  });
});
