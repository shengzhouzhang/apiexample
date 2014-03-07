define(function() {
  
  var OAuthUtils = {};
  
  OAuthUtils.isAnEarlyCloseHost= function( hostName ) {
    
    return hostName && hostName.match(".*google(apis)?.com$")
  }
  
  return OAuthUtils;
});