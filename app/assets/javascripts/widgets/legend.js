$.widget("ui.legend", {
  options: {
    width: 200, 
    height: 0
  },
  _create: function() {
    var self = this;
    self.images = self.element.find('> div');
    self._bindEvents();

  },
  _bindEvents: function(){
    var self = this;
    self.element.find('h2 a').first().click(function(e){
      e.preventDefault();
      if(self.element.is('.visible')){
        self.hideImages();
      }else{
        self.showImages();
      }
      self.element.toggleClass('visible');
    });
  },
  showImages: function(){
    var self = this;
    $('#legende').show();
    self.images.animate({ width: self.options.width });
  },
  hideImages: function(){
    var self = this;
    self.images.animate({ width: 0}, function(){
      $('#legende').hide();
    })
  },   
  updateSize: function(width){
    var self = this;


    // Handles width change
    var originalWidth = self.options.width;
    if(width > originalWidth) {
      self.options.width = width;
      $('#legende').css("width", width);
    }
    // Handles max height
    var height = self.element.css("height");
    if(parseInt(height) > parseInt($(".olMap").css("height"))){
      self.element.find("#legende").css("max-height", $(".olMap").css("height"));
    }
  },
  move:function(pixel, animate){
    var self = this;
    var left = self._leftValue() - pixel;
    left = left < 0 ? 0 : left;
    if(animate){
      self.element.animate({left:left});
    }else{
      self.element.css({left:left});
    }
  },
  _minLeft: function(){
    var self = this;
    return self.element.find('h2').first().width();
  },
  _selfWidth: function(){
    var self = this;
    return self.element.outerWidth();
    return self.options.width; 
  },
  _leftValue: function(){
    var self = this;
    return parseInt(self.element.css('left'));
  },
  
  destroyLayer: function(layer) {
    this.element.find("#"+layer.uniqueID+"_legende").remove();
  },

  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
