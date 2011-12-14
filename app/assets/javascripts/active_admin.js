//=# require active_admin/base
//= require jquery
//= require jqueryui
//= require rails
//= require pure
//= require jquery/jquery.multiselect.js
//= require bootstrap
//= require j.textarea
//= require admin/layers
//= require timepicker

$(function(){
  $(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});

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
  
  $("#features").click(function(e) {
    e.preventDefault();
    $.get("/layers/"+$(this).attr("layer_id")+"/getfeatures.json",
        function(data) {
          $('<div>'+data+'</div>').dialog({title: "Liste des features"}); 
        });
  });
});
