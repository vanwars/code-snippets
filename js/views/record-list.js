define(["jquery",
        "underscore",
        "marionette",
        "collection",
        "handlebars",
        "handlebars-helpers"
    ],
    function ($, _, Marionette, Collection, Handlebars) {
        'use strict';
        /**
         * Controls a dictionary of overlayGroups
         * @class OverlayManager
         */
        //Todo: can this be a Marionette CollectionManager, since it's managing Layer models?
        var RecordList = Marionette.View.extend({

            events: {
                'click .page': 'newPage',
                'keyup #filter' : 'filterCollection'
            },
            opts: null,
            filterVal: null,
            dataAttribute: "results",

            childViewContainer: '.data-container',

            initialize: function (opts) {
                this.opts = opts;
                this.dataAttribute = opts.data_attribute || "results";
                this.collection = new Collection({
                    api_url: this.updateUrlWithRouterData(opts),
                    query_params: this.updateParamsWithRouterData(opts),
                    page_size: opts.page_size || 10,
                    comparator: opts.ordering_field || "id",
                    enableFiltering: opts.enable_filtering || false,
                    filterFields: opts.filter_fields || [],
                    dataAttribute: this.dataAttribute,
                    dataType: opts.data_type || "json",
                    nextURL: opts.next_url || "next"
                });
                this.listenTo(this.collection, 'reset', this.renderWithHelpers);
                this.loadTemplateFromFile(opts);
            },

            filterCollection: _.throttle(function (e) {
                this.filterVal = $(e.currentTarget).val();
                this.collection.filter(this.filterVal);
                this.collection.trigger('reset');
            }, 500),

            updateUrlWithRouterData: function (opts) {
                var template = Handlebars.compile(opts.api_url);
                return template(opts);
            },

            updateParamsWithRouterData: function (opts) {
                if (!opts.query_params) {
                    return {};
                }
                var query_params = {};
                _.each(opts.query_params, function (param, key) {
                    if (typeof param == 'string') {
                        var template = Handlebars.compile(param);
                        template = template(opts);
                        query_params[key] = template;
                    } else {
                        query_params[key] = param;
                    }
                });
                return query_params;
            },
            loadTemplateFromFile: function (opts) {
                if (this.template) {
                    this.collection.fetch({reset: true});
                    return;
                }
                var path = 'templates/' + opts.template_path  + '?rand' + Math.random(),
                    that = this;
                $.ajax({
                    url: path,
                    dataType: "text",
                    success: function (template) {
                        that.template = Handlebars.compile(template);
                        that.collection.fetch({reset: true});
                    }
                });
            },

            renderWithHelpers: function () {
                this.templateHelpers = {
                    next: this.collection.next,
                    previous: this.collection.previous,
                    count: this.collection.count,
                    filterVal: this.filterVal
                };
                this.collection.sort();
                this.render();
            },

            newPage: function (e) {
                var that = this;
                this.collection.url = $(e.target).attr('page-num');
                this.collection.fetch({
                    data: {},
                    success: function () {
                        that.renderWithHelpers();
                    }
                });
                e.preventDefault();
            },

            focusCursorIfSearchbox: function () {
                //place the cursor at the end of the input filter:
                var $input = this.$el.find('#filter'),
                    len;
                if (!$input.val()) { return; }
                len = $input.val().length;
                $input.focus();
                $input.get(0).setSelectionRange(len, len);
            },

            render: function () {
                var data = {},
                    json = this.collection.getVisibleCollection().toJSON();
                _.extend(data, this.templateHelpers);
                _.extend(data, this.opts);
                data[this.dataAttribute] = json;
                this.$el.html(this.template(data));
                this.focusCursorIfSearchbox();
            }

        });

        return RecordList;
    });