define([
  "template",
  "use!backbone",
  "twitter"
],

function(Template, Backbone, Twitter) {
  
  var tweet = {};
  
  tweet.view = Backbone.View.extend({
    
    template: "views/tweet.view",
    
    render: function(done) {
      
      var view = this;
      
      Template.fetchTemplate(this.template, function(tmpl) {
        
        var template = tmpl({tweet: view.model.toJSON()});
        
        view.$el.html(template);
        
        if (_.isFunction(done)) {
          
          done();
        }
      });
    },
    
    events: {
      "click button.tweet": "tweet",
      "click a.signout": "signout"
    },
    
    tweet: function(event) {
      
      event.preventDefault();
      
      var content = $("textarea.tweet").val();
      
      if (content.length > 140) {
       
        content = content.substring(0, 139);
      }
      
      console.log(content);
      
      Twitter.tweet(content);
    },
    
    signout: function() {
      
      window.location = "http://localhost:8888/projects/TwitterApp/index.html";
    },
  });
  
  tweet.model = Backbone.Model.extend({
    
    initialize: function() {
      
    },
  });
  
  return tweet;
});