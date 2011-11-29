$.widget("ui.categorySlider", {
  options: {
    position: "right"
  },
  _create: function() {
    var self = this;
    self._intializePosition(self.options.position);
    self.element.addClass('ui-widget ui-helper-reset ui-accordion ui-accordion-icons');
    self.element.find('.childrens h4').sliderLink({ 
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
    self.element.find('.childrens h4').not(sliderLink).each(function(i,el){
      $(el).sliderLink('closePanel'); 
    });
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
  _addHeader: function(){
    var self = this;
    var header = $('<div class="ui-widget-header"></div>');
    header.append($('<span class="ui-icon ui-icon-circle-close"></span>'));
    header.append($('<span class="title-header">'+self.options.title+'</span>'));
    self.element.prepend(header);
  },
  _leftPositioning: function(){
    var self = this;
    var left_place;
    if (self.options.position != "left"){
        left_place = (- self.element.outerWidth());
    }
    else{
      left_place = self.element.prev('.childrens h4').outerWidth();
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
      self.element.effect('slide', { direction : self._slideDirection()})
      //console.log("yep");
      //map.updateSize();
    }
  },
  hide: function(){
    var self = this; 
    if(self.element.is(':visible')){
      self.element.effect('slide', {direction : self._slideDirection(), mode:'hide'})
    }
  
  },
  _bindEvents: function(){
    var self = this;
    self.element.find('.ui-icon-circle-close').click(function(e){
      $(self.element.prev('.childrens h4')).sliderLink('closePanel');
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
    self.parent = self.options.parent;
    self.visiblePanel = self.options.visiblePanel;
    self.panel = self.element.next('.category_description').sliderPanel({
                                                                height: self.options.panelHeight,
                                                                position: self.options.position,
                                                                title: self.element.text()
                                                                });
    self.element.addClass('ui-accordion-header ui-helper-reset ui-state-default ui-corner-all');
    self._addIcon();
    self._bindEvents();
  },
  _showPanel: function(){
    var self = this; 
    self._showArrow();
    self.panel.sliderPanel('show');
    self.visiblePanel = true;
  },
  _hidePanel: function(){
    var self = this; 
    self._hideArrow();
    self.panel.sliderPanel('hide');
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
        $(self.parent).categorySlider('willShow',self.element);
        self.element.queue(self._showPanel());
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
