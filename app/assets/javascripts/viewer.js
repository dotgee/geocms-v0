$.widget("ui.viewer", {
  options: {
    accordionPosition: "right",
    mapId: "map",
    map : null,
    fullscreen: false
  },

  _bindEvents: function(){
    var self = this;
    self.legendBtn.click(function(e){
      e.preventDefault();
    });
    self.layersBtn.click(function(e){
      e.preventDefault();
      self.layerChooser.layerChooser('show');
    });

    self.layerChooserAccordion.find('.category_layer_container').click(function(e){
      e.preventDefault();
      var div = $(this);
      var other_divs = $("." + div.attr('layer_class'));
      other_divs.toggleClass('added_layer');
      var layer = map.getLayer(div.attr('layer_id'));
      if(div.is('.added_layer')){
        if (!layer) {
          var title = div.attr('layer_title');
          var wms_url = div.attr('wms_url');
          var layer_name = div.attr('layer_name');
          layer = new OpenLayers.Layer.WMS(title,
                                               wms_url,
                                               { layers: layer_name,
                                                 transparent: true
                                               },
                                               {
                                                 opacity: 0.8,
                                                 singleTile: true,
                                                 uniqueID: layer_name.replace(":", "_")
                                               });
          map.addLayer(layer);

          // Generates the legend for the new layer
          var legende = $("#legende div:first-child").clone();
          legende.attr("id", layer.uniqueID+"_legende");
          legende.find("p").text(layer_name);
          legende.find("img").attr("src", "http://geo.devel.dotgee.fr/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+layer_name);
          $("#legende").append(legende);
          
          div.attr('layer_id', layer.id);
        }else{
          layer.setVisibility(true);
          $("#"+layer.uniqueID+"_legende").show(300);
        }
        $("."+layer.uniqueID).show(300);
      }
      else{
        if(layer){
          layer.setVisibility(false);
          $("#"+layer.uniqueID+"_legende").hide(300);
          $("."+layer.uniqueID).hide(300);
        }
      }

  });
    self.layersListBtn.click(function(e){
      
      e.preventDefault();
      var icon = self.layersListBtn.find('.ui-icon').first();
      if(self.layerChooserAccordion.is(":visible")){
        icon.removeClass('ui-icon-circle-arrow-s').addClass('ui-icon-circle-arrow-e');
        self.layerChooserAccordion.hide("slow", function(){ 
          self.mapinfos.mapinfos('redraw');
       });
      }
      else{
        icon.removeClass('ui-icon-circle-arrow-e').addClass('ui-icon-circle-arrow-s');
        self.layerChooserAccordion.show("slow");
      }
      map.updateSize();
    });
    self.fullScreenBtn.click(function(e){
      e.preventDefault();
      $('#map').height($(window).height()).width($(window).width()); 
      if(self.fullscreenDisplay){
        self._normalLayout();
        $('.topbar').fadeIn();
        self.element.removeAttr('style');
        self.element.css('padding', '10px');
      }else{
        self.element.css('z-index', 16000);
        $('.topbar').fadeOut();
        self.element.animate({
          width: $(window).width(),
          height: $(window).height(),
          padding: 0,
          marginTop: -$(this).offset().top
        });
        self._fullscreenLayout();
      }
      self.fullscreenDisplay = !self.fullscreenDisplay;
    });
    $(window).resize(function(){
      self.mapinfos.mapinfos('redraw');
    });
  },

  _fullscreenLayout: function(){

  },
  _normalLayout: function(){

  },
  resizeChooser: function(){
    var self = this;
  },
  _create: function() {
    var self = this;
    self.map = self.options.map;
    self.fullscreenDisplay = self.options.fullscreen;
    self.mapinfos = $('.map-infos').first().mapinfos({});
    self.fullScreenBtn = self.element.find('.full_screen_btn').first();
    self.layersListBtn = $('#layers_list_btn');
    self.legendBtn = $('#legend_btn');
    self.layersBtn = self.element.find('.add_layer_btn').first();
    self.layerChooser = $('#layer_dialog').layerChooser({});
    self.layerChooserAccordion = $('#category_chooser').categorySlider({  
                                                                          position: self.options.accordionPosition
                                                                       });//.accordion({active: 100, collapsible: true, fillSpace: true});
                                                                       self.layerChooserAccordion.show();
    self._bindEvents();
  },
  _map: null,
  _mapDiv: null,
  getMapDiv: function(){
    if(!this._mapDiv){
      this._mapDiv = $('#'+this.options.mapId);
    }
    return this._mapDiv;
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments); // default destroy
  }
 });
