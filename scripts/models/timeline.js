define([
  
  "jquery",
  "use!underscore",
  "use!backbone",
  "template",
  
  "./tweet",
  "./tweets",
  
  "twitter"
],

function($, _, Backbone, Template, Tweet, Tweets, Twitter) {

  var timeline = {
    tweet: {},
    tweets: {}
  };
  
  timeline.view = Backbone.View.extend({
    
    template: "views/timeline.view",
    
    render: function(done) {
      
      var timeline = this;
      
      Template.fetchTemplate(this.template, function(tmpl) {
        
        var template = tmpl();
        
        timeline.$el.html(template);
        
        if (timeline.model.get("username") === undefined) {
          
          timeline.loadAttrobutes();

        } else {
          
          //localStorage.clear();
          timeline.saveAttributes();
        }
        
        var tweet = new Tweet.view({
          
          el: $("div.tweet_container"),
          model: new Tweet.model({
            username: timeline.model.get("username"),
            screenname: timeline.model.get("screenname"),
            profile_image: timeline.model.get("profile_image"),
            following: timeline.model.get("following"),
            tweet: timeline.model.get("tweet"),
            follower: timeline.model.get("follower"),
          })
        });
        
        tweet.render();
        
        timeline.loadBackground();
        //timeline.disableFooter();
        
        //$("div.tweets_container").hide();
        
        Twitter.getPreviousTweets(null, function(data) {
          
          var tweets;
          
          // check limits 
          if (data && !data.errors) {
            
            //$("div.tweets_container").show();
            
            tweets = new Tweets.view({
              
              el: $("div.tweets_container"),
              collection: new Tweets.collection(data)
            });
            
          } else {
            
            //$("div.tweets_container").show();
            
            // fetch from local storage
            tweets = new Tweets.view({
              
              el: $("div.tweets_container"),
              collection: new Tweets.collection([])
            });
          }
          
          tweets.render(function(el){
            
            Tweets.stream(function(data) {
              
              if (data && data.length > 0) {
                
                tweets.collection.add(data);
                tweets.showNewTweets(data.length);
              }
            });
            
            tweets.hideNewTweets();
            
            if (_.isFunction(done)) {
              done();
            }
          });
        });
      });
    },
    
    saveAttributes: function() {
      
      localStorage.username = this.model.get("username");
      localStorage.screenname = this.model.get("screenname");
      localStorage.following = this.model.get("following");
      localStorage.tweet = this.model.get("tweet");
      localStorage.follower = this.model.get("follower");
      localStorage.background = this.model.get("background");
      localStorage.background_color = this.model.get("background_color");
    },
    
    loadAttrobutes: function() {
      
      this.model.set("username", localStorage.username);
      this.model.set("screenname", localStorage.screenname);
      this.model.set("following", localStorage.following);
      this.model.set("tweet", localStorage.tweet);
      this.model.set("follower", localStorage.follower);
      this.model.set("background", localStorage.background);
      this.model.set("background_color", localStorage.background_color);
    },
    
    loadBackground: function() {
      
      if(this.model.get("background")) {
        
        if (this.model.get("background_image"))
          $("body").css("background-image", "url('" + this.model.get("background_image") + "')");
        $("body").css("background-attachment", "fixed");
        $("body").css("background-repeat", "no-repeat");
        $("body").css("background-color", this.model.get("background_color"));
      }
    },
  });
  
  
  timeline.model = Backbone.Model.extend({
    
    initialize: function() {
      
    },
    
    localStorage: new Backbone.LocalStorage("profile")
  });
  
  return timeline;

});