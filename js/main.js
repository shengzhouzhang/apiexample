$(document).ready(function() {
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.onreadystatechange = function() {
    
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log(xmlhttp.responseText);
    }
  };
  
  
    
  xmlhttp.open("POST", "https://api.twitter.com/oauth/request_token", true);
  
  xmlhttp.setRequestHeader("oauth_consumer_key", "PJRLbV20luTzVuSS3etAXw");
  
  xmlhttp.send();
});

