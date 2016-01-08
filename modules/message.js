;(function() {

    var global = this;

    var Message = function Message(options) {
        Sphere.Core.Base.call(this, options);
        // -----------------------------
        // option      | type
        // -----------------------------
        // event       | string
        // data        | string/object
    };

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
                obj = JSON.stringify(this.attributes);
                break;
        }
        return obj;
    };

    Message.prototype.parse = function(str) {
        var obj = this.json(str);
        if (typeof obj === 'object' && typeof obj.message === 'string') {
            obj.message = this.json(obj.message);
        }
        for (prop in obj) {
            this.set(prop, obj[prop]);
        }
        return this;
    };

    Sphere.Module.Message = Message;

}.call(this || window));
