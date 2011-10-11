// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery-1.6.4.min
//= require jqueryui 
//= require OpenLayers-2.11/OpenLayers
//= require jtmpl
//= require bootstrap
//= require j.textarea
//= require widgets

$(document).ready(function(){
  $('#layer_tab').tabs();
  $('#add_layer_btn').click(function(){
     
  });
$( "#layer_dialog" ).dialog({
      autoOpen: false,
      resizable: false,
      modal: true,
      width: 600,
    height: 500,
      buttons: {
        "Ajouter couche": function() {
          alert('ajout de couche');
          $( this ).dialog( "close" );
        },
        "Annuler": function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      }
    });

    $( "#add_layer_btn" )
      .button()
      .click(function(e) {
          e.preventDefault();
        $( "#layer_dialog" ).dialog( "open" );
      });

  $('textarea').TextAreaResizer();
  $('.popover').popover2();
  $('input[rel=popover]').bind('focus', function(e){
    $(this).popover({offset:10}).popover('show');
  }).blur(function(e){
    $(this).popover('hide');
  });
  //$('#layer_dialog').dialog();
});
