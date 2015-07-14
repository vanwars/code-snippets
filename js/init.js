define(["underscore",
        "jquery",
        "backbone",
        "marionette",
        "views/base",
        "views/record-list",
        "views/record-detail"
    ],
    function (_, $, Backbone, Marionette, BaseView, RecordListView, RecordDetailView) {
        "use strict";
        var App = new Marionette.Application();
        _.extend(App, {
            pages: {},
            routes: {},
            routeViews: {},
            appRouter: null,
            defaultTarget: '.section-content',
            spokesTarget: '.explore_mainnav',

            buildViews: function (pages) {
                var that = this;
                /* Dynamically builds Backbone Views from the config file */
                _.each(pages, function (page) {
                    var View = that.getView(page),
                        v;
                    if (page.url) {
                        that.routeViews[page.url] = View;
                    } else {
                        v = new View(page);
                        $(page.target || that.defaultTargets).html(v.el);
                        v.delegateEvents();
                        //setTimeout(that.addListeners.bind(that), 1000);
                    }
                });
            },
            getPageByRoute: function (route) {
                alert(this.pages[route]);
            },
            getView: function (page) {
                switch (page.type) {
                case "list":
                    return RecordListView.extend(page);
                case "detail":
                    return RecordDetailView.extend(page);
                default:
                    return BaseView.extend(page);
                }
            },

            buildRoutes: function (pages) {
                var that = this;
                /* Dynamically builds Backbone Routes from the config file */
                _.each(pages, function (page) {
                    that.pages[page.url] = page;
                    if (page.type == "detail") {
                        page.modelID = page.id;
                    }
                    that.routes[page.url] = function (param1, param2, param3) {
                        that.loadView(page, param1, param2, param3);
                    };
                });
            },

            updatePageWithRouterParams: function (page, param1, param2, param3) {
                //note that routers can have multiple dynamic parameters
                var hops = page.url.split("/"),
                    params = [param1, param2, param3],
                    param;
                _.each(hops, function (hop) {
                    if (hop.indexOf(':') != -1) {
                        param = hop.replace(':', '');
                        page[param] = params.shift();
                    }
                });
            },

            loadView: function (page, param1, param2, param3) {
                this.updatePageWithRouterParams(page, param1, param2, param3);

                var View = this.routeViews[page.url],
                    view = new View(page);
                $(page.target || this.defaultTarget).html(view.el);
                view.delegateEvents();
                //remove and re-add event listeners:
                this.addListeners();
            },

            addListeners: function () {
                return;
            },

            init: function () {
                this.buildViews(this.pages);
                this.buildRoutes(this.pages);
                var AppRouter = Backbone.Router.extend({
                    routes: this.routes
                });
                this.appRouter = new AppRouter();
                Backbone.history.start();
            }
        });

        App.addInitializer(function () {
            var that = this;
            $.getJSON('config.json',
                function (data) {
                    that.pages = data.pages;
                    that.init();
                });
        });
        return App;
    });

