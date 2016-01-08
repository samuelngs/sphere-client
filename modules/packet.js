;(function() {

    var global = this;

    var Packet = function Packet(options) {
        Sphere.Core.Base.call(this, options);
        // -----------------------------
        // option      | type
        // -----------------------------
        // type        | string
        // namespace   | string
        // room        | string
        // cid         | number
        // error       | string
        // message     | string/object
        // reply       | boolean
        // callback    | function
    };

    Packet.prototype.json = function(str) {
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

    Packet.prototype.parse = function(str) {
        var obj = this.json(str);
        if (typeof obj === 'object' && typeof obj.message === 'string') {
            var message = new Sphere.Module.Message();
            message.parse(obj.message);
            obj.message = message;
        }
        for (prop in obj) {
            this.set(prop, obj[prop]);
        }
        return this;
    };

    Sphere.Module.Packet = Packet;

}.call(this || window));
