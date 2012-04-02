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
//= require proj4js/proj4js
//= require placeholder.hack
//= require mustache
//= require fileuploader
//= require j.bookmark.js

/* Includes the csrf token in every ajax request
$(document).ajaxSend(function(e, xhr, options) {
  var token = $("meta[name='csrf-token']").attr("content");
  xhr.setRequestHeader("X-CSRF-Token", token);
});
*/
var fullscreen = false;

$(document).ready(function(){
  // lien métadonnées
  //init metadialog
  $('body').click(function(e){
    $('ul.submenu').removeClass('open');
  });
  $('#resource_link').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    var sub = $(this).next('ul');
    sub.toggleClass('open');
  });
  $('#meta_dialog').dialog({
    autoOpen: false,
    title: "Metadonn\351e",
    width : "80%", 
    height: 600,
    modal: true
  });
  $('.btn-metadatas,.metadata_link').live('click', function(e){
    e.preventDefault();
    var dial = $('#meta_dialog');
    var url = $(this).attr('href')
    dial.find('.content').first().attr('src', url);
    var title = $('<span />').text("Metadonn\351e sur ")
    var link = $('<a />').attr('href', url.replace('.embedded','')).attr('target', '_blank').text(url);
    title.append(link)
    $('#meta_dialog').dialog("option", "title", title.html());
    $('#meta_dialog').dialog('open'); 
  });
  
  //block legende
  $('#legend_container').legend();
  //tab couches selectionneur
  $('#layer_tab').tab();
  // filter du category chooser
  $('.filters').filter();

  $('textarea').not('.not_resizable').TextAreaResizer();
  //tooltip des différent liens
  //$('.fg-buttonset a').tooltip({html: true});
  $('span[rel=popover]').tooltip({delayIn: 200});
  $('.category_layer_container').tooltip({placement: "left"});
  $('.right_twipsy').tooltip({placement: "right", html: true});
  $('.ui-icon-extlink').tooltip().
                        on('hover', function(){
                          $(this).parents('.category_layer_container').first().tooltip('hide');

                        });
  //spinner pour ajax
  $('#wait').spin();

  $('.alert-message .close').live('click', function(e){
    e.preventDefault();
    var parent = $(this).parent();
    parent.slideUp( function(){ parent.remove(); });
  });
  $('.hidable_label').hide_label();
  $('#link-share a').click(function(e){
    e.preventDefault();
    $('#social-networks').toggle();
    $('#make-link').hide();
  }).one('click', function(){
     $('#social-networks-content').bookmark({sites:
         ['blogmarks','wikio','delicious','yahoo','digg','viadeo','facebook','google','twitter','netvibes'],
             compact: false
               });
    });
  $('#header a.close').click(function(e){
    e.preventDefault();
     $('#make-link, #social-networks').hide();
  });
  $('#permalink_maker').click(function(e){
    e.preventDefault();
    $('#make-link').toggle();
    $('#make-link textarea').val(window.location).select();
     $('#social-networks').hide();
  });
});

  $.fn.hide_label = function(){
    var self = $(this);
    var input = self.next('.controls').find('input').first();
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
function getURLParameter(name) {
  return decodeURI( (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}
