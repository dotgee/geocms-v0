$.widget("ui.viewer", {
  options: {
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
      div.toggleClass('selected_layer');
      if(div.is('.selected_layer')){
        //alert('ajout de cette couche sur la carte');
        var title = div.attr('layer_title');
        var wms_url = div.attr('wms_url');
        var layer_name = div.attr('layer_name');
        var  layer = new OpenLayers.Layer.WMS(title,
                                   wms_url,
                                   {
                                       layers: layer_name,
                                       transparent: true
                                   }, {
                                       opacity: 0.5,
                                       singleTile: true
                                   });
        map.addLayer(layer);
      }
      else{
        alert('couche retir\351e de la carte');
      }

  });
    self.layersListBtn.click(function(e){
      
      e.preventDefault();
      var icon = self.layersListBtn.find('.ui-icon').first();
      if(self.layerChooserAccordion.is(":visible")){
        icon.removeClass('ui-icon-circle-arrow-s').addClass('ui-icon-circle-arrow-e');
        self.layerChooserAccordion.hide("slow", function(){ 
          self.mapinfos.mapinfos('redraw');
          map.updateSize();
       });
      }
      else{
        icon.removeClass('ui-icon-circle-arrow-e').addClass('ui-icon-circle-arrow-s');
        self.layerChooserAccordion.show("slow");
      }
    });
    self.fullScreenBtn.click(function(e){
      e.preventDefault();
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
      self.layerChooserAccordion.accordion('resize');
    });
  },

  _fullscreenLayout: function(){

  },
  _normalLayout: function(){

  },
  resizeChooser: function(){
    var self = this;
    self.layerChooserAccordion.accordion('resize');
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
    self.layerChooserAccordion = $('#category_chooser').accordion({active: 100, collapsible: true, fillSpace: true});
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
