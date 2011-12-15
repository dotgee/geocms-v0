$.widget("ui.categorySlider", {
  options: {
    position: "right"
  },
  _create: function() {
    var self = this;
    self._intializePosition(self.options.position);
    self.element.addClass('ui-widget ui-helper-reset ui-accordion ui-accordion-icons');
    var with_children = self.element.find('.parent')
    //self.element.find('.childrens h4').sliderLink({ 
    with_children.sliderLink({ 
                        panelHeight: self.element.parent().height(), 
                        position: self.options.position,
                        parent: self.element 
                        });
    self._bindEvents();
  },
  _intializePosition: function(left_or_right){
    var self = this;
    var css_class = left_or_right +"_positioning";
    self.element.addClass(css_class);
  },


  _init: function(){
    var self = this; 
  },
  _bindEvents: function(){
    var self = this;
  },
  _toggleArrow: function(h3){
  },
  willShow: function(sliderLink){
    var self = this;
    self.element.find('.parent').not(sliderLink).each(function(i,el){
      $(el).sliderLink('closePanel'); 
    });
    self.element.find('h3.selected, h4.selected').each(function(i,el){
      $(el).removeClass('selected');
      });
  },
  showFilteredLayers: function(css_classes){
    var self = this;
    self.element.find('.parent').each(function(i,el){
      $(el).sliderLink('filtered', css_classes);
    });
    self._updateParents();
    self._updateGrandParents();
  },
  _updateParents: function(){
    var self = this;
    self._parents().each(function(i,el){
      $(el).sliderLink('updateLayersCount');
      $(el).sliderLink('hideFilteredLayers');
    });

  },
  _updateGrandParents: function(){
    var self = this;
    self._grandParents().each(function(i,el){
      var gp = $(el);
      var nbLayers = 0;
      gp.next('.children').first().find('.parent').each(function(i,sliderlink){
        nbLayers += $(sliderlink).sliderLink('nbLayers');
      });
      gp.find('.nb_layers').first().text('('+nbLayers+')');
      if(nbLayers > 0){
        gp.slideDown();
      }else{
        gp.slideUp();
      }
    });
  },
  _parents: function(){
    var self = this;
    if(!self.layer_parents){
      self.layer_parents = self.element.find('.parent');
    }
    return self.layer_parents;
  },
  _grandParents: function(){
    var self = this;
    if(!self.layer_grandParents){
      self.layer_grandParents = self.element.find('.grand_parent');
    }
    return self.layer_grandParents;
  },
  showAllLayers: function(){
    var self = this;
    self.element.find('.parent').each(function(i,el){
      $(el).sliderLink('unfilter');
    });
    self._updateParents();
    self._updateGrandParents();
    self.element.find('.parent, .grand_parent').slideDown();
    
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });

$.widget("ui.sliderPanel", {
  options: {
    height: 100,
    title: "",
    position: "left"
  },
  _create: function() {
    var self = this;
    self.element.hide().addClass('sliders ui-helper-reset ui-widget-content ui-corner-all');
    self.element.css({height: self.options.height, left : self._leftPositioning()});
    self._addHeader();
    self._bindEvents();
  },
  updateLayersCount: function(){
    var self = this;
    self.element.find('.nbLayers').first().text('('+self.nbNotFilteredLayer()+")");
  },
  nbNotFilteredLayer: function(){
    var self = this;
    return self.element.find('.category_layer_container').not('.filtered_layer').length;
  },
  _addHeader: function(){
    var self = this;
    var header = self.element.find('.header').first().addClass('ui-widget-header');
    header.prepend($('<span class="ui-icon ui-icon-circle-close"></span>'));
  },
  _leftPositioning: function(){
    var self = this;
    var left_place;
    if (self.options.position != "left"){
        left_place = (- self.element.outerWidth());
    }
    else{
      left_place = self.element.prev('.parent').outerWidth();
    }
    return left_place;
  
  },
  _slideDirection: function(){
    var self = this; 
    if( self.options.position != "left"){
      return "right";
    }
    return "left";
  },
  show: function(){
    var self = this; 
    if(!self.element.is(':visible')){
      $('#legend_container').stop(false, true).legend('move', self.element.outerWidth(), true);
      self.element.height($('#map').height()-2); //-2 pour les bordures : pas trés propre
      self.element.effect('slide', { direction : self._slideDirection()})
      self.element.addClass('visible');
    }
  },

  hide: function(){
    var self = this; 
    if(self.element.is(':visible')){
      $('#legend_container').stop(false, true).legend('move', - self.element.outerWidth(), true);
      self.element.effect('slide', {direction : self._slideDirection(), mode:'hide'})
      self.element.removeClass('visible');
    }
  
  },
  _bindEvents: function(){
    var self = this;
    self.element.find('.ui-icon-circle-close').click(function(e){
      $(self.element.prev('.parent')).sliderLink('closePanel');
    });
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
$.widget("ui.sliderLink", {
  options: {
    position: "right",
    panelHeight: 200,
    parent: null,
    visiblePanel: false
  },
  _create: function() {
    var self = this;
    self.category_slider = self.options.parent;
    self.visiblePanel = self.options.visiblePanel;
    self.element.addClass('ui-sliderLink');
    self.panel = self.element.next('.category_description').sliderPanel({
                                                                height: self.options.panelHeight,
                                                                position: self.options.position,
                                                                title: self.element.html()
                                                                });
    self.element.addClass('ui-accordion-header ui-helper-reset ui-state-default ui-corner-all');
    self._addIcon();
    self._bindEvents();
  },
  filtered: function(selector){
    var self = this;
    self._layerContainers().each(function(i, el){
      var element = $(el);
      var will_hide = true;
      for(var sel in selector){
        if(element.is(selector[sel])){
          will_hide = false;
          element.removeClass('filtered_layer')
        }
      }
      if(will_hide){
        element.addClass('filtered_layer');
      }
    });
  },
  unfilter: function(){
    var self = this;
    self._layerContainers().each(function(i, el){
      $(el).removeClass('filtered_layer').show();
    });
  },
  hideFilteredLayers: function(){
    var self = this;
    self._description().find('.category_layer_container').each(function(i,el){
        var elt =$(el);
      if(elt.is('.filtered_layer')){
        elt.hide();
      }else{
        elt.show();
      }
    
    });
    if(self._layerContainers().length == self._description().find('.filtered_layer').length){
        self.element.slideUp();
      }else{
        self.element.slideDown();
      }
  },
  updateLayersCount: function(){
    var self = this;
    var nb = self.element.find(".nb_layers").first();
    nb.html("("+self.nbLayers()+")");
    self.panel.sliderPanel('updateLayersCount');
  },
  nbLayers: function(){
    var self = this;
    return self.panel.sliderPanel('nbNotFilteredLayer');
  },
  _layerContainers : function(){
    var self = this;
    var cat_desc = self._description();
    if(!self.layerContainers){
      if(cat_desc){
        self.layerContainers =  cat_desc.find('.category_layer_container');
      }else{
        self.layerContainers = []; 
      }
    }
    return self.layerContainers;
  
  },
  _description: function(){
    var self = this;
    if(!self.description){
      self.description = self.element.next('.category_description').first();
    }
    return self.description
  },
  _showPanel: function(){
    var self = this; 
    self._showArrow();
    self.panel.sliderPanel('show');
    if (self.element.is('h3')){
      self.element.addClass('selected');
    }else{
      self.element.parent().prev('h3').addClass('selected');
    }
    self.visiblePanel = true;
  },
  _hidePanel: function(){
    var self = this; 
    self._hideArrow();
    self.panel.sliderPanel('hide');
    self.element.removeClass('selected');
    self.visiblePanel = false;
  },
  _showArrow: function(){
      this.icon.addClass('ui-icon-triangle-1-w').removeClass('ui-icon-triangle-1-e');
  },
  _hideArrow: function(){
      this.icon.addClass('ui-icon-triangle-1-e').removeClass('ui-icon-triangle-1-w');
  },
  _bindEvents: function(){
    var self = this;
    self.element.click(function(e){
      e.preventDefault();
      if(self.visiblePanel){
        self._hidePanel();
      }else{
        $(self.category_slider).categorySlider('willShow',self.element);
        self._showPanel();
      }
    });
  },
  openPanel: function(){
    var self = this;
    this._showPanel();
  },
  closePanel: function(){
    var self = this;
    this._hidePanel();
  },
  _addIcon: function(){
      var self = this;
      var icon = $('<span class="ui-icon ui-icon-triangle-1-e"></span>'); 
      this.element.prepend(icon);
      self.icon = self.element.find('.ui-icon').first();
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
