$.widget("ui.legend", {
  options: {
    width: 200, 
    height: 0
  },
  _create: function() {
    var self = this;
    self._bindEvents();
  },
  _bindEvents: function(){
    var self = this;
    self.element.find('h2 a').first().click(function(e){
      e.preventDefault();
      var new_left = self._leftValue()  
      if(self.element.is('.visible')){
        new_left += self._selfWidth();
        new_left = new_left > 0 ? 0 : new_left;
        self.element.animate({left:new_left  }, function(){
          $("#legende").css('visibility', 'hidden');
        });
      }else{
        $('#legende').css('visibility', 'visible');
        self.element.animate({left: new_left - self._selfWidth() });
      }
      self.element.toggleClass('visible');
    });
  },
  updateSize: function(width){
    var self = this;

    // Handles width change
    var originalWidth = self._selfWidth();
    if(width > originalWidth) {
      self.options.width = width;
      self.element.css("width", width);
      if(self.element.hasClass("visible")){
        self.move(width - originalWidth, true); 
      }
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
