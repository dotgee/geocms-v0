CKEDITOR.plugins.add( 'features',
{
  init: function( editor )
  {
    var items;
    var layer = $("#layer").val();
    if(layer) {
      $.get("/layers/"+layer+"/getfeatures.json",
        function(data) {
          items = data;
      });
      editor.addCommand( 'insertFeatures', new CKEDITOR.dialogCommand( 'featuresDialog' ) );

      editor.ui.addButton( 'Features',
      {
        label: 'Inserer des features',
        command: 'insertFeatures',
        icon: this.path + 'images/icon.png'
      });

      CKEDITOR.dialog.add( 'featuresDialog', function ( editor )
      {
        return {
          title : 'Liste des features',
          minWidth : 400,
          minHeight : 200,
       
          contents :
          [
            {
              id : 'general',
              label : 'Settings',
              elements :
              [
                {
                  type : 'html',
                  html : 'Choisissez dans la liste ci-dessous l\'information voulue et validez'
                },
                {
                  type : 'select',
                  id : 'features',
                  label : 'Features',
                  items : items,
                  size: 10,
                  commit : function( data )
                  {
                    data.features = this.getValue();
                  }
                }
              ]
            }
          ],
          onOk: function()
          {
            var dialog = this,
                data = {};
            this.commitContent( data );
            editor.insertHtml("{{"+data.features+"}}");
          }
        };
      } );
   }
  }
});
