define(function() {
  
  var https = {};
  var xhr, data;
  
  function createCORSRequest(method, url) {
    
    var xhr = new XMLHttpRequest();
    
    if ("withCredentials" in xhr) {
      
      xhr.open(method, url, true);
      
    } else if (typeof XDomainRequest != "undefined") {
      
      xhr = new XDomainRequest();
      
      xhr.open(method, url);
      
    }
    
    return xhr;
  };
  
  https.request = function(options) {
    
    var url = "https://" + options.host + "" + options.path;
    
    xhr = new createCORSRequest(options.method, url);
    
    xhr.setRequestHeader("Accept", options.headers.Accept); 
    xhr.setRequestHeader("Authorization", options.headers.Authorization); 
    xhr.setRequestHeader("Content-Type", options.headers["Content-Type"]);
    
    return xhr;
    
  };
  
  https.on = function(callback) {
    
    xhr.onload = function() {
      
      callback(null, xhr.responseText)
    };
    
    xhr.onerror = function() {
      
      console.log("error: " + xhr.responseText);
    };
  };
    
  https.write = function(_data) {
  
    data = _data;
  };
  
  https.end = function() {
    
    if (xhr !== undefined && xhr !== null) {
      
      if (data !== undefined && data !== null)
        xhr.send(data);
      else
        xhr.send();
      
      delete xhr;
    }
  };
  
  return https;
});