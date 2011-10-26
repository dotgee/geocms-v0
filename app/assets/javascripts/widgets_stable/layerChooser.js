$.widget("ui.layerChooser", {
  options: {
  },
  _create: function() {
    var self = this;
    self.element.dialog({
      autoOpen: false,
      resizable: false,
      modal: true,
      width: 600,
      height: 500,
      buttons: {
        "Ajouter couche": function() {
          $( this ).dialog( "close" );
        },
        "Annuler": function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
      }
    });

    self._bindEvents();
  },
  show: function(){
    this.element.dialog('open');
  },
  _bindEvents: function(){
  },
  destroy: function() {
    $.Widget.prototype.destroy.apply(this, arguments);
  }
 });
