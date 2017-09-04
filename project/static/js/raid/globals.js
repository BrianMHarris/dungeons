
// Create this single global settings object, using an immediately invoked function
var globalSettings = (function() {
  var instance;

  function initialize() {
    var debugMode=true;
    // Store the width and the height. later, set the style of the container div to these values
    return {
      getDebugMode: function(){
        return debugMode;
      },
      getCanvasWidth: function(){

      },
      getCanvasHeight: function(){

      },
      getContext: function(){

      }
    }
  }

  // return an object with appropriate methods; will only initalize the instance once
  return {
    instance: function() {
      if (!instance) {
        instance = initialize();
      }

      return instance;
    }
  }
})();
