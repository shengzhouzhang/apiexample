define([
  "template",
  "use!backbone",
  "./tweet",
  "./tweets",
  "twitter"
],

function(Template, Backbone, Tweet, Tweets, Twitter) {

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
        
        var tweet = new Tweet.view({
          
          el: $("div.tweet_container"),
          model: new Tweet.model({
            username: timeline.model.get("username"),
            profile_image: timeline.model.get("profile_image"),
            following: timeline.model.get("following"),
            tweet: timeline.model.get("tweet"),
            follower: timeline.model.get("follower"),
          })
        });
        
        tweet.render();
        
        timeline.loadBackground();
        timeline.disableFooter();
        
        Twitter.getPreviousTweets(null, function(data) {
          
          var tweets = new Tweets.view({
            
            el: $("div.tweets_container"),
            collection: new Tweets.collection(data)
          });
          
          tweets.render(function(el){
            
            Tweets.stream(function(data) {
              
              if (data.length > 0) {
                
                tweets.collection.add(data);
                tweets.showNewTweets(data.length);
              }
              
              console.log(tweets.collection.length);
            });
            
            tweets.hideNewTweets();
            //tweets.scroll();
            
            if (_.isFunction(done)) {
              done();
            }
          });
        });
      });
    },
    
    loadBackground: function() {
      
      if(this.model.get("background")) {
        
        $("body").css("background-image", "url('" + this.model.get("background_image") + "')");
        $("body").css("background-attachment", "fixed");
        $("body").css("background-repeat", "no-repeat");
        $("body").css("background-color", this.model.get("background_color"));
      }
    },
    
    disableFooter: function() {
      
      //console.log($("div.footer"));
      $("#footer").hide();
    },
  });
  
  
  timeline.model = Backbone.Model.extend({
    
    initialize: function() {
      
    },
  });
  
  return timeline;

});