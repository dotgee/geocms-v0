$.widget("ui.legend", {
  options: {
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
    return parseInt(self.element.outerWidth()); 
  },
  _leftValue: function(){
    var self = this;
    return parseInt(self.element.css('left'));
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });