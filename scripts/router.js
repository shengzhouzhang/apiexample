define([
  
  // Libraries
  "use!backbone",
  
  // models
  "models/signin",
  "models/timeline",
  
  // API
  "twitter"
],

function(Backbone, Signin, TimeLine, Twitter) {
  
  var router = {
    
    base: "http://localhost:8888/projects/TwitterApp/index.html",
    
  };
  
  Twitter.Init(router.base + "#/oauth_step2");
  
  var AppRouter = Backbone.Router.extend({
    
    routes: {
      "timeline/:params": "timeline",
      "oauth_step2": "oauth_step2", // twitter callback handler
      "*action":   "signin"
    },

    signin: function() {
      
      var router = this;
      
      // to signin view
      var signin = new Signin.view({
        el: $("#wrap")
      });
      
      signin.render();
    },
    
    oauth_step2: function(params) {
      
      var router = this;
      
      if (window.location.search !== "") {
        
        var query = window.location.search.substring(1);
        
        var params = query.split('&');
        
        if (params.length === 2) {
          
          var values_1 = params[0].split('=');
          var values_2 = params[1].split('=');
          
          if (values_1[0] === "oauth_token" && 
              values_2[0] === "oauth_verifier") {
            
            // to OAuth Step 3
            Twitter.OAuth_Step3(values_1[1], values_2[1], function() {
              
              router.toTimeLine();
            });
          }
        }
      }
    },
    
    toTimeLine: function() {
      
      var params = Twitter.getOAuthParams();
      
      window.location = router.base + "?#/timeline/" + params;
    },
    
    timeline: function(params) {
      
      Twitter.setOAuthParams(params);
      
      Twitter.getProfile(function(data) {
        
        // to time line view
        var timeline = new TimeLine.view({
          el: $("#wrap"),
          model: new TimeLine.model({
            username: data.name,
            profile_image: data.profile_image_url,
            background: data.profile_use_background_image,
            background_image: data.profile_background_image_url,
            background_color: "#" + data.profile_background_color,
            following: data.friends_count,
            tweet: data.statuses_count,
            follower: data.followers_count
          })
        });
        
        timeline.render();
      });
    },
  });
  
  router.start = function() {
    
    this.app = new AppRouter();
    Backbone.history.start();
  };
  
  return router;
});