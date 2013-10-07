define([
  "oauth",
  "twitter-entities"
  
], function(OAuth, Twitter_Entities) {
  
  var params = {
    
    // oauth parameters
    consumer_key: "PJRLbV20luTzVuSS3etAXw",
    consumer_secret: "x3kAgUo3OOmV4jP60uNx2cPd47mO2iWiXhf7cjaHsRo",
    oauth_version: "1.0",
    oauth_signature_method: "HMAC-SHA1",
    
    // rest url
    host: "api.twitter.com",
    protocol: "https",
    request_token: "oauth/request_token",
    access_token: "oauth/access_token",
    authenticate: "oauth/authenticate",
    profile: "1.1/users/show.json",
    timeline: "1.1/statuses/home_timeline.json",
    tweet: "1.1/statuses/update.json"
  };
  
  var API = {};
  var oauth;
  
  API.Init = function(callback_url) {
    
    oauth = new OAuth(
      params.protocol + "://" + params.host + "/" + params.request_token,
      params.protocol + "://" + params.host + "/" + params.access_token,

      params.consumer_key,
      params.consumer_secret,
      params.oauth_version,
      callback_url,
      params.oauth_signature_method
    );
  };
  
  API.OAuth_Step1 = function() {
    
    oauth.getOAuthRequestToken(function(err, token, token_secret, parsedQueryString) {
      
      params.oauth_token_secret = token_secret;
      
      if (parsedQueryString.oauth_callback_confirmed) {
        
        API.OAuth_Step2(token);
      }
    });
  };
  
  API.OAuth_Step2 = function(oauth_token) {
    
    window.location = params.protocol + "://" + params.host + "/" + params.authenticate + "?oauth_token=" + oauth_token;
  };
  
  API.OAuth_Step3 = function(oauth_token, oauth_verifier, callback) {
    
    oauth.getOAuthAccessToken(oauth_token, "", oauth_verifier, function(err, oauth_access_token, oauth_access_token_secret, results) {
      
      if (oauth_access_token)
        params.access_token = oauth_access_token;
      
      if (oauth_access_token_secret)
        params.access_token_secret = oauth_access_token_secret;
      
      if (results) {
        
        params.user_id = results.user_id;
        params.screen_name = results.screen_name;
      }
      
      callback();
    });
  };
  
  API.getOAuthParams = function() {
    
    var _params = "";
    
    _params += "?access_token=" + params.access_token;
    _params += "&access_token_secret=" + params.access_token_secret;
    _params += "&user_id=" + params.user_id;
    _params += "&screen_name=" + params.screen_name;
    
    return _params;
  };
    
  API.setOAuthParams = function(_params) {
    
    _params = _params.substring(1);
    
    var variables = _params.split('&');
    
    variables.forEach(function(variable) {
    
      var values = variable.split('=');
      
      params[values[0]] = values[1];
    });
  };
  
  API.getProfile = function(callback) {
    
    oauth.get(
      params.protocol + "://" + params.host + "/" + params.profile + "?user_id=" + params.user_id + "&screen_name=" + params.screen_name,
      params.access_token, 
      params.access_token_secret,
      function (e, data, res){
        
        if (data !== "")
          callback($.parseJSON(data));
        else
          callback();
      }
    );
  }
  
  API.getTimeLine = function(settings, callback) {
    
    oauth.get(
      params.protocol + "://" + params.host + "/" + params.timeline + '?' + settings,
      params.access_token, 
      params.access_token_secret,
      function (e, data, res){
        
        if (data !== "") {
          
          var json = $.parseJSON(data);
          
          if (!json.error && json.length > 0) {
            
            API.latest_id = json[0].id_str;
            API.least_id = json[json.length - 1].id_str;
          }
          
          callback(json);
          
        } else {
          
          callback();
        }
      }
    );
  };
  
  API.getLatestTweets = function(since_id, callback) {
    
    var settings = "count=20&screen_name=" + params.screen_name;
    
    if (since_id !== undefined && since_id !== null)
      settings += "&since_id=" + since_id;
    
    API.getTimeLine(settings, callback);
  };
  
  API.getPreviousTweets = function (max_id, callback) {
    
    var settings = "count=20&screen_name=" + params.screen_name;
    
    if (max_id !== undefined && max_id !== null)
      settings += "&max_id=" + max_id;
    
    API.getTimeLine(settings, callback);
  };
  
  API.tweet = function(content, callback) {
    
    content = encodeURIComponent(content);

    content =  content.replace(/\!/g, "%21")
      .replace(/\'/g, "%27")
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29")
      .replace(/\*/g, "%2A");
    
    oauth.post(
      params.protocol + "://" + params.host + "/" + params.tweet + "?display_coordinates=false&status=" + content,
      params.access_token, 
      params.access_token_secret, 
      null, 
      null,
      function(e, data, res) {
        
        if (data !== "") {
          
          var json = $.parseJSON(data);
          callback(json);
          
        } else {
          
          callback();
        }
      }
    );
  };
  
  API.parseEntities = Twitter_Entities.parse
    
  return API;
});