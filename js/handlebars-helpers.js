define(["handlebars"],
    function (Handlebars) {
        "use strict";

        Handlebars.registerHelper("paginator", function () {
            if (!this.next && !this.previous) {
                return null;
            }
            var template_html,
                template;
            template_html = '<div class="pager-container">' +
                            '<button class="btn btn-default page" page-num="{{ previous }}" {{ prev_disabled }}>&laquo; Previous</button>' +
                            '<button class="btn btn-default page" page-num="{{ next }}" {{ next_disabled }}>Next &raquo;</button>' +
                            '</div>';
            template = Handlebars.compile(template_html);
            template = template({
                previous: this.previous,
                next: this.next,
                prev_disabled: (this.previous ? '' : 'disabled'),
                next_disabled: (this.next ? '' : 'disabled')
            });
            return new Handlebars.SafeString(template);
        });

        Handlebars.registerHelper('first_n', function (ary, max, options) {
            var i, result = [];
            if (!ary || ary.length == 0) {
                return options.inverse(this);
            }
            for (i = 0; i < max && i < ary.length; ++i) {
                result.push(options.fn(ary[i]));
            }
            return result.join('');
        });

        Handlebars.registerHelper('slugify', function (text) {
            return text.toLowerCase().replace(/ /g, "-");
        });

        Handlebars.registerHelper('show_lat_lng', function (geom) {
            if (geom) {
                return geom.coordinates[1].toFixed(3) + ", " +
                            geom.coordinates[0].toFixed(3);
            }
            return null;
        });

        Handlebars.registerHelper('tagify', function (string) {
            if (!string) {
                return null;
            }
            var tags = string.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/),
                template_html = '<a class="tag" href="#/tags/{{ tag }}">{{ tag }}</a>',
                template,
                tagTemplate = '';
            _.each(tags, function (tag) {
                template = Handlebars.compile(template_html);
                template = template({tag: tag});
                tagTemplate += template;
            });
            return new Handlebars.SafeString(tagTemplate);
        });

        var sortObjectByValue = function (object) {
            var arr = [],
                sorted,
                key,
                newObject = {};
            for (key in object) {
                arr.push({ key: key, value: object[key] });
            }
            sorted = _(arr).sortBy(function (elem) {
                return -elem.value;
            });
            _.each(sorted, function (elem) {
                newObject[elem.key] = elem.value;
            });
            return newObject;
        };

        Handlebars.registerHelper('tag_inventory', function (results, attribute) {
            var that = this,
                tagDictionary = {},
                property,
                template_html = '<a class="tag gray-tag" href="#/tags/{{ tag }}">{{ tag }} <span class="badge">{{ count }}</badge></a><br>',
                template,
                tagTemplate = '';
            _.each(results, function (result) {
                property = result[attribute];
                if (property) {
                    property = property.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/);
                    _.each(property, function (tag) {
                        if (!that.filterVal || tag.indexOf(that.filterVal) != -1) {
                            if (!tagDictionary[tag]) {
                                tagDictionary[tag] = 0;
                            }
                            ++tagDictionary[tag];
                        }
                    });
                }
            });
            tagDictionary = sortObjectByValue(tagDictionary);
            _.each(tagDictionary, function (count, tag) {
                template = Handlebars.compile(template_html);
                template = template({ tag: tag, count: count });
                tagTemplate += template;
            });
            return new Handlebars.SafeString(tagTemplate);
        });

        Handlebars.registerHelper('searchbox', function () {
            var searchboxHTML = '<input id="filter" class="form-control" type="text" value="{{ filterVal }}" placeholder="Filter by Tag" />',
                template = Handlebars.compile(searchboxHTML);
            template = template({ filterVal: this.filterVal });
            return new Handlebars.SafeString(template);
        });


    });