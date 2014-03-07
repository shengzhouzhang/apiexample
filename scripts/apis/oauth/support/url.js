define(function() {
  
  var URL = {};
  
  URL.parse = function(url) {
    
    var parser = document.createElement('a');
    
    parser.href = url;
    parser.query = parser.search.substring(1);
    
    return parser;
  };
  
  return URL;
  
});