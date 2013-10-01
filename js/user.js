function User(options) {
  
  //var username = options.username;
  var tokens;
};

User.prototype.signin = function(password) {
  
  var url = "https://api.twitter.com/oauth/authorize";
  
  $.ajax({
    type: 'GET',
    url: url + '?oauth_token:"200281781-dHMO9W0J3w6eqrgQ7f3E7Y6k4CdKofMK6a8Z2qOs"callback=?', 
    async: false,
    jsonpCallback: 'myFancyFunction',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
      console.log(json);
    },
    error: function(e) {
      //console.log(e);
    }
  });
}