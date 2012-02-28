//= require jquery
//= require jqueryui 
//= require rails
//= require OpenLayers-2.11/OpenLayers
//= require bootstrap.min
//= require j.textarea
//= require widgets
//= require proj4js/proj4js
//= require placeholder.hack
//= require mustache
//= require fileuploader

var leftPan, controls, legende, layerFinder;

$(document).ready(function(){
  leftPan = new $.leftPanel($("#selected"));
  legende = new $.legend($("#legende_container"));
  controls = new $.controls($(".fg-buttonset"));
  layerFinder = new $.layerFinder($(".accordion-inner"));

  // lien métadonnées
  $('.btn-metadatas,.metadata_link').live('click', function(e){
    e.preventDefault();
    var dial = $('#meta_dialog');
    var url = $(this).attr('href');
    dial.find('.content').first().attr('src', url);
    var title = $('<span />').text("Metadonn\351e sur ")
    var link = $('<a />').attr('href', url.replace('.embedded','')).attr('target', '_blank').text(url);
    title.append(link);
    $('#meta_dialog').dialog("option", "title", title.html());
    $('#meta_dialog').dialog('open'); 
  });
  
  $('textarea').not('.not_resizable').TextAreaResizer();

  $('a[rel=tooltip]').tooltip({placement: "bottom", html: true});

  $('.alert-message .close').live('click', function(e){
    e.preventDefault();
    var parent = $(this).parent();
    parent.slideUp( function(){ parent.remove(); });
  });
});
