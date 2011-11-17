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
//= require spin.min.js
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
  $('a[rel=popover]').twipsy({});
  $('.category_layer_container').twipsy({placement: "left"});
  $('#wait').spin();
  $('.alert-message .close').live('click', function(e){
    e.preventDefault();
    var parent = $(this).parent();
    parent.slideUp( function(){ parent.remove(); });
  });
});

$.fn.spin = function(opts) {
  this.each(function() {
    var $this = $(this), data = $this.data();

    if (data.spinner) {
      data.spinner.stop();
      delete data.spinner;
    }
    if (opts !== false) {
      data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
    }
  });
  return this;
};
