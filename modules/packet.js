
var Base = require('../core/base');
var Message = require('../modules/message');

module.exports = (function() {

    var global = this;

    var Packet = function Packet(options) {
        Base.call(this, options);
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

    Packet.Type = {
        Message      : 'message',
        Channel      : 'channel',
        Subscribe    : 'subscribe',
        Unsubscribe  : 'unsubscribe',
        Subscribed   : 'subscribed',
        Unsubscribed : 'unsubscribed',
        Ping         : 'ping',
        Pong         : 'pong',
        Unknown      : 'unknown'
    };

    Packet.prototype = Object.create(Base.prototype);
    Packet.prototype.constructor = Packet;

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
                var attrs = {};
                for (var props in this.attributes) {
                  if (!((props || '').indexOf('_') === 0)) {
                    attrs[props] = this.attributes[props];
                  }
                }
                if (attrs.message instanceof Message) {
                  var msg = {};
                  for (var props in attrs.message.attributes) {
                    if (!((props || '').indexOf('_') === 0)) {
                      msg[props] = attrs.message.attributes[props];
                    }
                  }
                  attrs.message = msg;
                }
                obj = JSON.stringify(attrs);
                break;
        }
        return obj;
    };

    Packet.prototype.parse = function(str) {
        var obj = this.json(str);
        if (typeof obj === 'object' && typeof obj.message === 'string') {
            var message = new Message();
            message.parse(obj.message);
            obj.message = message;
        }
        for (var prop in obj) {
            this.set(prop, obj[prop]);
        }
        return this;
    };

    return Packet;

}.call(this || window));
