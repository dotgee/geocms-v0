(function(){

  var v = "1.7.1";
  options.baseUrl = "http://cartographie.gipbe.dotgee.fr/";
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement("script");
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        initMap(options);
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    initMap(options);
  }

  function initMap(options) {
   $(document).ready(function(){ 
    (window.myMap = function() {
      var divId = options.divId;
       var height = options.height || 300;
       var width = options.width || 400;
       $("#"+divId).append(""+
           "<div id='mapIframe'>"+
             "<iframe src='"+options.baseUrl + options.objectType+"/"+options.objectId+"/external?width="+width+"&height="+height+"' onload=''>Enable iFrames.</iframe>"+
           "</div>");
        var style = $(""+
          "<style type='text/css'>"+
            "#mapIframe iframe{ width:"+options.width+"px; height:"+options.height+"px; border: none}"+
          "</style>");
        style.appendTo($(document.getElementsByTagName("head")[0]));
    })();
    });
  }
})();

