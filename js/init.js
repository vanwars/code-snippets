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
                        setTimeout(that.addListeners.bind(that), 1000);
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
                this.executeTransition(page.target);
                //remove and re-add event listeners:
                this.addListeners();
                this.highlightSelected(page);
            },

            executeTransition: function (target) {
                switch (target) {
                case this.defaultTarget:
                    $("#explore_section").addClass("showme");
                    break;
                }
            },

            switchSpokes: function () {
                var $target = $(this.spokesTarget);
                $target.removeClass("original").addClass("hide-wheel-right");
                setTimeout(function () {
                    $target.removeClass("hide-wheel-right").addClass("hide-wheel-left");
                    setTimeout(function () {
                        $target.removeClass("hide-wheel-left").addClass("original");
                    }, 40);
                }, 500);
            },

            addListeners: function () {
                var that = this;

                $("#close-project").unbind("click");
                $('#close-project').click(function (e) {
                    $("#explore_section").removeClass("showme");
                    e.preventDefault();
                    that.appRouter.navigate('home', {trigger: true});
                });

                $(".nav-icon").unbind("click");
                $('.nav-icon').click(function () {
                    if ($(this).hasClass("load-spokes")) {
                        that.switchSpokes();
                    }
                });
            },
            highlightSelected: function (page) {
                var url = '#/' + page.url,
                    $elem = $('a[href="' + url + '"]');
                setTimeout(function () {
                    if ($elem.length > 0) {
                        $elem.addClass('active').siblings().removeClass('active');
                    }
                }, 500);
            }
        });

        App.addInitializer(function (opts) {
            this.buildViews(opts.pages);
            this.buildRoutes(opts.pages);
            var AppRouter = Backbone.Router.extend({
                routes: this.routes
            });
            this.appRouter = new AppRouter();
            Backbone.history.start();
        });
        return App;
    });

