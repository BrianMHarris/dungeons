
// TODO: Make this take a list of image urls and names (in an object) and load all at once.
//  optimizes the unitmanager and effect manager big time.

// Create this single image manager
var imageManager = (function() {
  var instance;

  function initialize() {
    // variables
    var imageCache = {};
    // Setter/Getter methods
    return {
      loadImage: function(name, url) {
        if (!(name in imageCache)) {
          imageCache[name] = new Image();
          imageCache[name].src = url;
        }
        return imageCache[name];
      },
      getImageByName: function(name) {
        if (name in imageCache)
          return imageCache[name];
        else
          console.log("imageManager::Missing Image - " + name)
      }
    }
  }

  // return an object with appropriate methods; happens once only
  return {
    instance: function() {
      if (!instance)
        instance = initialize();
      return instance;
    }
  }
})();
