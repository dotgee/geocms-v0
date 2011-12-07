//=# require active_admin/base
//= require jquery
//= require jqueryui
//= require rails
//= require jquery/jquery.multiselect.js
//= require bootstrap
//= require j.textarea
//= require admin/layers
$(function(){
  $(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});

    $(".clear_filters_btn").click(function(){
        window.location.search = "";
            return false;
              });
              });

$(document).ready(function(){
  $('select[multiple=multiple]').multiselect({});
  $('.alert-message .close').live('click', function(e){
    e.preventDefault();
    var parent = $(this).parent();
    parent.slideUp( function(){ parent.remove(); });
  });
});
