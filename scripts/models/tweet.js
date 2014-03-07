define([
  
  "jquery",
  "use!underscore",
  "use!backbone",
  "template",
  "twitter"
],

function($, _, Backbone, Template, Twitter) {
  
  var tweet = {};
  
  tweet.view = Backbone.View.extend({
    
    template: "views/tweet.view",
    
    render: function(done) {
      
      var view = this;
      
      Template.fetchTemplate(this.template, function(tmpl) {
        
        var template = tmpl({tweet: view.model.toJSON()});
        
        view.$el.html(template);
        
        $("div.alert").hide();
        
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
      
      Twitter.tweet(content, function(data) {
        
        var alert = $("div.alert");
        
        if (data && !data.errors)
          alert.addClass("alert-success").html("Your tweet was posted.");
        else
          alert.addClass("alert-danger").html("Your tweet wasn't posted.");
        
        alert.show();
        
        setTimeout(function() {
        
          alert.hide().removeClass("alert-danger").removeClass("alert-success").html("");
          
        }, 2000);
      });
    },
    
    signout: function() {
      
      //localStorage.clear();
      window.location = "http://localhost:8888/projects/TwitterApp/index.html";
    },
  });
  
  tweet.model = Backbone.Model.extend({
    
    initialize: function() {
      
    },
  });
  
  return tweet;
});