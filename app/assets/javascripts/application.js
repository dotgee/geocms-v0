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
//= require widgets/filter
//= require proj4js/proj4js
//= require placeholder.hack
//= require mustache

var fullscreen = false;

$(document).ready(function(){
  $('.selected_icon').attr('data-original-title', 'Ajouter/retirer cette couche au visualiseur').twipsy({delayIn: 300});
  $('#legend_container').legend();
  $('#layer_tab').tabs();
  $('.filters').filter();
  $('textarea').not('.not_resizable').TextAreaResizer();
  $('a[rel=popover]').twipsy({html: true});
  $('span[rel=popover]').twipsy({delayIn: 200});
  $('.category_layer_container').twipsy({placement: "left"});
  $('#wait').spin();
  $('.alert-message .close').live('click', function(e){
    e.preventDefault();
    var parent = $(this).parent();
    parent.slideUp( function(){ parent.remove(); });
  });
  $('.hidable_label').hide_label();
});

  $.fn.hide_label = function(){
    var self = $(this);
    var input = self.next('.input').find('input').first();
    if ($.trim(input.val()) == '') { 
      self.css('visibility','');
      self.show();
    }else{
      self.css('visibility','hidden');
      self.hide();
    }
    self.click(function(e){ 
                input.focus();
    });
    input.focus(function() { 
                  self.css('visibility','hidden');
                  self.hide();
           }).change(function(){
               $(this).val($.trim($(this).val()));
                if ($(this).val() == '') {
                  self.css('visibility','');
                  self.show();
                }
           }).blur(function() { 
                $(this).val($.trim($(this).val())); 
                if ($(this).val() == '') { 
                  self.css('visibility','');
                  self.show();
                } 
              });
  };
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
