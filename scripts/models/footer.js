define([
  
  "jquery",
  "use!underscore",
  "use!backbone",
  "template",
],

function($, _, Backbone, Template) {

  var footer = {};

  footer.view = Backbone.View.extend({
    
    Template: "views/footer.view",

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
  });

  return footer;

});