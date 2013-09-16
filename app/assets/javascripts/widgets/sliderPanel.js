$.widget("ui.sliderPanel", {
  options: {
    height: 100,
    title: "",
    position: "left"
  },
  _create: function() {
    var self = this;
    self.element.hide().addClass('sliders ui-helper-reset ui-widget-content ui-corner-all');
    self.element.css({height: self.options.height, left : 0});
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
    var title_header = header.find('.title-header').first();
    title_header.append($('<span class="close_panel">fermer</span>'));
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
      self.element.removeClass('visible');
      self.element.effect('slide', {direction : self._slideDirection(), mode:'hide'}, function(){
        if($('#layers_availables .category_description.visible').length < 1){
          $('#layers_availables').animate({left: 0});
        }
      });

      //$('#layers_availables').css('left', 0)
    }
  
  },
  _bindEvents: function(){
    var self = this;
    self.element.find('.close_panel').click(function(e){
      $(this).closest('.category_description').sliderPanel('hide');
    });
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
