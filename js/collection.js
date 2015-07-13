define(["underscore", "jquery", "backbone", "model"],
    function (_, $, Backbone, Model) {
        "use strict";
        /**
         * An "abstract" Backbone Collection; the root of all of the other
         * localground.collections.* classes. Has some helper methods that help
         * Backbone.Collection objects more easily interat with the Local Ground
         * Data API.
         * @class localground.collections.Base
         */
        var Base = Backbone.Collection.extend({
            key: null,
            next: null,
            previous: null,
            count: 0,
            page_size: 100,
            opts: null,
            enableFiltering: false,
            dataAttribute: "results",
            dataType: "json",
            nextURL: "next",
            filterFields: [],
            model: Model,
            defaults: {
                isVisible: true
            },
            initialize: function (opts) {
                this.opts = opts;
                _.extend(this, opts);
            },
            url: function () {
                if (this.query_params) {
                    return this.api_url + '?' + $.param(this.query_params);
                }
                return this.api_url;
            },
            sync : function (method, collection, options) {
                options.dataType = this.dataType;
                return Backbone.sync(method, collection, options);
            },
            parse: function (response) {
                this.count = response.count;
                this.next = eval("response." + this.nextURL);
                this.previous = response.previous;
                return eval("response." + this.dataAttribute);
            },
            filter: function (filterVal) {
                var that = this;
                if (!this.enableFiltering) { return; }
                this.each(function (model) {
                    model.checkMatch(filterVal, that.filterFields);
                });
            },
            getVisibleCollection: function () {
                var collection = new Base();
                this.each(function (item) {
                    if (!item.get("hide")) { collection.add(item); }
                });
                return collection;
            }

        });

        return Base;
    });
