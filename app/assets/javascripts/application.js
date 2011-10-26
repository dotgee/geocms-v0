// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//
//= require jquery
//= require jqueryui 
//= require rails
//= require OpenLayers-2.11/OpenLayers
//= require bootstrap
//= require j.textarea
//= require widgets
//= require viewer
//= require layerChooser
//= require widgets/categorySlider

var fullscreen = false;

$(document).ready(function(){
  $('#layer_tab').tabs();

  $('textarea').TextAreaResizer();

  $('.twipsy_link').each(function(i,el){
    var link = $(el);
    var placement;
    if(link.is('.right')){
      placement = "right";
    }else{
      if(link.is('.left')){
        placement = "left";
      }

    }
    link.twipsy({ 
                placement: placement,
                delayIn: 500
              });

  });
});

