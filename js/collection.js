define(["underscore", "jquery", "backbone"],
    function (_, $, Backbone) {
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
            parse: function (response) {
                this.count = response.count;
                this.next = response.next;
                this.previous = response.previous;
                return response.results;
            },
            filter: function (filterVal) {
                _.each(this.models, function (record) {
                    if (record.get("tags") && record.get("tags").indexOf(filterVal) == -1) {
                        record.set("hide", true);
                    } else {
                        record.set("hide", false);
                    }
                });
            },
            getVisibleCollection: function () {
                var collection = new Base(this.opts);
                this.each(function (item) {
                    if (!item.get("hide")) { collection.add(item); }
                });
                return collection;
            }

        });

        return Base;
    });
