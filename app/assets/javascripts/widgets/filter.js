$.widget("ui.filter", {
  options: {
    cible_id : "#category_chooser"
  },
  _create: function() {
    var self = this;
    self.listing = $(self.options.cible_id);
    self._bindEvents();
  },
  _init: function(){
    var self = this; 
  },
  _bindEvents: function(){
    var self = this;
    self.element.find('input[type=checkbox]').click(function(e){
      e.stopPropagation();
      var checked = self._checked();
      if(checked.length > 0){
        var css_classes = $.map(checked, function(el){
          return '.'+$(el).val();
        });
        $(self.options.cible_id).categorySlider('showFilteredLayers', css_classes);  
        self._removeFilterLink().fadeIn();
      }else{
        self._removeFilterLink().fadeOut();
        $(self.options.cible_id).categorySlider('showAllLayers');  
      }
    });
    self._removeFilterLink().click(function(e){
      e.preventDefault();
      if(self._checked().length > 0){
        self._checked().each(function(i,el){
          $(el).prop('checked', false);
        });
        $(self.options.cible_id).categorySlider('showAllLayers');  
        self._removeFilterLink().fadeOut();
     }
    });
  },
  _removeFilterLink: function(){
    var self = this;
    if(!self.removeLink){
      self.removeLink = self.element.find('#removeFilters');
    }
    return self.removeLink;
  },
  _notChecked: function(){
    var self = this;
    return self.element.find('input[type=checkbox]').not(':checked');
  },
  _checked: function(){
    var self = this;
    return self.element.find('input[type=checkbox]:checked');
  },
  _showLayers: function(css_class){
  
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });

