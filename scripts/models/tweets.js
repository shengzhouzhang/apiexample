define([
  "template",
  "use!backbone",
  "twitter"
],

function(Template, Backbone, Twitter, scroll) {
  
  var tweets = {};
  
  tweets.view = Backbone.View.extend({
    
    template: "views/tweets.view",
    
    render: function(done) {
      
      var view = this;
      
      Template.fetchTemplate(this.template, function(tmpl) {
        
        var raw = view.collection.toJSON();
        
        var tweets = [];
        
        raw.forEach(function(tweet) {
        
          tweets.push({
            username: tweet.user.name,
            screenname: tweet.user.screen_name,
            profile_image_url: tweet.user.profile_image_url,
            text: Twitter.parseEntities(tweet)
          });
        });
        
        var template = tmpl({tweets: tweets});
        
        view.$el.html(template);
        
        if (_.isFunction(done)) {
          done();
        }
      });
    },
    
    new_tweets: 0,
    
    hideNewTweets: function() {
      
      this.new_tweets = 0;
      $("div.new_tweets").hide();
    },
    
    showNewTweets: function(num) {
      
      this.new_tweets += num;
      
      $("div.new_tweets").text(this.new_tweets + " new tweets").show();
    },
    
    events: {
      "click div.new_tweets": "loadNewTweets",
    },
    
    loadNewTweets: function(event) {
      
      this.render();
      this.hideNewTweets();
    },
  });
  
  tweets.stream = function(done) {
    
    setInterval(function() {
      
      console.log("load...");
      
      Twitter.getLatestTweets(Twitter.latest_id, function(data) {
        
        if (_.isFunction(done)) {
          done(data);
        }
      });
      
    }, 60000);
  };
  
  tweets.model = Backbone.Model.extend({
    
    initialize: function() {
      
    },
  });
  
  tweets.collection = Backbone.Collection.extend({
    
    model: tweets.model,
    
    comparator: function(tweet) {
    
      return -tweet.get("id_str");
    },
  });
  
  return tweets;
});