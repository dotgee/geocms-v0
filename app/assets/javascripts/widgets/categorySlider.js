$.widget("ui.categorySlider", {
  options: {
  },
  _create: function() {
    var self = this;
    self.element.addClass('ui-widget ui-helper-reset ui-accordion ui-accordion-icons');
    self.element.find('h3').sliderLink({ panelHeight: self.element.parent().height(), parent: self.element });
    self._bindEvents();
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
    self.element.find('h3').not(sliderLink).each(function(i,el){
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
    left: 0
  },
  _create: function() {
    var self = this;
    self.element.hide().addClass('sliders ui-helper-reset ui-widget-content ui-corner-all');
    self.element.css({height: self.options.height, left : -self.element.outerWidth()});
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
  show: function(){
    var self = this; 
    if(!self.element.is(':visible')){
      self.element.effect('slide', {direction : 'right'})
    }
  },
  hide: function(){
    var self = this; 
    if(self.element.is(':visible')){
      self.element.effect('slide', {direction : 'right', mode:'hide'})
    }
  
  },
  _bindEvents: function(){
    var self = this;
    self.element.find('.ui-icon-circle-close').click(function(e){
      $(self.element.prev('h3')).sliderLink('closePanel');
    });
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
$.widget("ui.sliderLink", {
  options: {
    panelHeight: 200,
    parent: null,
    visiblePanel: false
  },
  _create: function() {
    var self = this;
    self.parent = self.options.parent;
    self.visiblePanel = self.options.visiblePanel;
    self.panel = self.element.next('.category_description').sliderPanel({height: self.options.panelHeight, title: self.element.text()});
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
