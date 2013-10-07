define([
  "template",
  "use!underscore",
  "use!backbone",
  "twitter"
],

function(Template, _, Backbone, Twitter) {

  var signin = {};

  signin.view = Backbone.View.extend({
    
    Template: "views/signin.view",

    render: function(done) {
      
      var view = this;

      Template.fetchTemplate(this.Template, function(tmpl) {
        
        var Template = tmpl();
        
        view.$el.html(Template);

        if (_.isFunction(done)) {
          done();
        }
      });
    },
    
    events: {
      "click button.signin": "signin"
    },
    
    signin: function(event) {
      
      event.preventDefault();
      
      localStorage.clear();
      Twitter.OAuth_Step1();
    }
  });

  return signin;

});