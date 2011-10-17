$.widget("ui.widgetname", {
  options: {
  },
  _create: function() {
    var self = this;
    self._bindEvents();
  },
  _bindEvents: function(){
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
