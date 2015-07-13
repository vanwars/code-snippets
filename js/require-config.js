require.config({
    baseUrl: "js",
    paths: {
        'backbone': 'external/backbone-min',
        'handlebars': 'external/handlebars.min',
        'jquery': '//code.jquery.com/jquery-1.8.0.min',
        'jquery.bootstrap': '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min',
        'text': 'external/text',
        'marionette': 'external/backbone.marionette',
        'underscore': 'external/underscore-min'
    },
    shim: {
        'underscore': {
            exports: "_"
        },
        'backbone': {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        },
        'marionette': {
            deps: [ "backbone" ],
            exports: "Marionette"
        },
        'handlebars': {
            exports: "Handlebars"
        },
        'jquery.bootstrap': {
            deps: ['jquery']
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});


