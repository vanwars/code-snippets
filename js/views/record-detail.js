define(["underscore", "marionette", "model", "views/view-mixin"],
    function (_, Marionette, Model, ViewMixin) {
        "use strict";
        var RecordView = Marionette.ItemView.extend({
            model: null,
            modelEvents: {
                'change': 'render'
            },
            onBeforeRender: function () {
                //console.log("onBeforeRender", this.model);
                //_.extend(this.extras, this.model.toJSON());
            },
            initialize: function (opts) {
                var that = this;
                _.extend(this, opts);
                this.model = new Model({
                    table_id: opts.table_id,
                    recordID: opts.param1
                });
                this.model.fetch({
                    success: function () {
                        _.extend(that.extras, that.model.toJSON());
                        that.render();
                    }
                });
                this.render();
            }
        });
        _.extend(RecordView.prototype, ViewMixin);
        return RecordView;
    });