require.config({
  // Initialize the application with the main application file
  deps: ["main"],

  paths: {

    // Libraries
    jquery: "./libs/jquery/jquery-2.0.3.min",
    underscore: "./libs/underscore/underscore-min",
    backbone: "./libs/backbone/backbone-min",
    localstorage: "./libs/backbone/backbone.localStorage-min",
    bootstrap: "./libs/bootstrap.min.js",
    
    template: "./libs/namespace",
    use: "./libs/use",
    
    
    // API
    twitter: "./apis/twitter",
    "twitter-entities": "./apis/twitter-entities",
    
    // OAuth
    oauth: "./apis/oauth/oauth",
    sha1: "./apis/oauth/support/sha1",
    https: "./apis/oauth/support/https",
    url: "./apis/oauth/support/url",
    querystring: "./apis/oauth/support/querystring",
    querystring_util: "./apis/oauth/support/querystring-util",
    oauth_util: "./apis/oauth/support/oauth-util"
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    }
  }
});