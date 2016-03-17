
var Base = require('../core/base');

module.exports = (function() {

    var Message = function Message(options) {
        Base.call(this, options);
        // -----------------------------
        // option      | type
        // -----------------------------
        // event       | string
        // data        | string/object
    };

    Message.prototype = Object.create(Base.prototype);
    Message.prototype.constructor = Message;

    Message.prototype.json = function(str) {
        var obj;
        switch(typeof str) {
            case 'string':
                try {
                    obj = JSON.parse(str);
                } catch(e) {
                    obj = str;
                }
                break;
            default:
                var attrs = {};
                for (var props in this.attributes) {
                  if (!((props || '').indexOf('_') === 0)) {
                    attrs[props] = this.attributes[props];
                  }
                }
                obj = JSON.stringify(attrs);
                break;
        }
        return obj;
    };

    Message.prototype.parse = function(str) {
        var obj = this.json(str);
        if (typeof obj === 'object' && typeof obj.message === 'string') {
            obj.message = this.json(obj.message);
        }
        for (var prop in obj) {
            this.set(prop, obj[prop]);
        }
        return this;
    };

    return Message;

}.call(this || window));
