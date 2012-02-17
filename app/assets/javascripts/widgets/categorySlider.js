$.widget("ui.categorySlider", {
  options: {
    position: "right"
  },
  _create: function() {
    var self = this;
    self._intializePosition(self.options.position);
    self.element.addClass('ui-widget ui-helper-reset ui-accordion ui-accordion-icons');
    var with_children = self.element.find('.parent')
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
    var listing = $('#layer_listing');
    listing.find(' > .parent, > .grand_parent').slideDown();
    listing.find('.children .parent:visible').slideUp();
    
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });

