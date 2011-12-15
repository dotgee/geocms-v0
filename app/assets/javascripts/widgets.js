$.widget("ui.mapinfos", {
   // default options
   options: {
   },
   _create: function() {
    var self = this;
    self._setGoodSize();
    self._bindEvents();
    self._slideDown(0);
   },
   redraw: function(){
    var self = this; 
    self._setGoodSize();
   },
   _setGoodSize: function(){
      var self = this; 
      var parentWidth = this.element.parent().width();
      this.element.width(parentWidth);
      this.element.show();
      self._centerSlider();
   },
    _bindEvents: function(){
      var self = this;
      self._btnSlider().bind('click', function(e){
        var icon = $(this);
        if(icon.is('.up')){
          self._slideDown();
        }
        else{
          self._slideUp();
        }
      });
      self.element.mouseenter(function(){
            self.element.css({"background-color" :'rgba(0, 0, 0, 0.8)'});  
            self._btnSlider().parent().css({"background-color" :'rgba(0, 0, 0, 0.8)'});  
          }).
          mouseleave(function(){
            self.element.css({"background-color" :'rgba(0, 0, 0, 0.5)'});  
            self._btnSlider().parent().css({"background-color" :'rgba(0, 0, 0, 0.5)'});  

          });
   },
   _centerSlider : function(){
     var self = this;
     var parentSlider = self._btnSlider().parent(); 
     parentSlider.css({left : (self.element.width() - parentSlider.width())/2});
  
   },
   _slideUp: function(){
     var self = this;
     self.element.animate({bottom: 0}, function(){self._setUpSlider()});
   },
   _slideDown: function(animation_time){
    var time = !animation_time ? 1000 : "normal";
      var self = this; 
      var new_position = - self._getBoxHeight();//self._getHeaderHeight() - self._getBoxHeight();// + self._btnSlider().height(); 
      self.element.animate( { bottom: new_position }, time, function(){self._setDownSlider()});
   },
   _getHeaderHeight: function(){
    return this.element.find('.modal-header').first().outerHeight()-1;
   },
   _getBoxHeight: function(){
    return this.element.height();
   },
   _setUpSlider: function(){
    this._btnSlider().
          removeClass('down').
          addClass('up');
   },
   _setDownSlider: function(){
    this._btnSlider().
          addClass('down').
          removeClass('up');
   },
   _btnSlider: function(){
    var self = this;
    return self.element.find('.info-slider').first(); 
   },
   destroy: function() {
       $.Widget.prototype.destroy.apply(this, arguments); // default destroy
        // now do other stuff particular to this widget
   }
 });

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
