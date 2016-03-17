
var Base = require('../core/base');
var Packet = require('../modules/packet');
var Message = require('../modules/message');

module.exports = (function() {

    var Channel = function Channel(options) {
        Base.call(this, options);

        // option      | type
        // -----------------------------
        // namespace   | string
        // room        | string
        // client      | object

        // defaults and states
        this.set('subscribed', false);
    };

    Channel.prototype = Object.create(Base.prototype);
    Channel.prototype.constructor = Channel;

    Channel.prototype.subscribe = function(accesskey, callback) {
        var channel = this;
        if (!this.get('client')) {
            return this.log('could not find websocket client');
        }
        if (typeof this.get('namespace') !== 'string' || typeof this.get('room') !== 'string') {
            return this.log('could not find channel namespace and room name');
        }
        var ws = this.get('client');
        var args = {
            type      : Packet.Type.Subscribe,
            namespace : this.get('namespace'),
            room      : this.get('room'),
        };
        if (accesskey) {
          var message = new Message({
              event     : 'access_token',
              data      : accesskey,
          });
          args.message = message;
        }
        var packet = new Packet(args);
        if (typeof callback === 'function') {
            packet.set('callback', function(response) {
                callback.call(channel, response);
                channel.emit('subscribed');
                ws.emit('subscribed', channel);
            });
        }
        this.emit('subscribe');
        ws.send(packet);
    };

    Channel.prototype.unsubscribe = function(callback) {
        var channel = this;
        if (!this.get('client')) {
            return this.log('could not find websocket client');
        }
        if (typeof this.get('namespace') !== 'string' || typeof this.get('room') !== 'string') {
            return this.log('could not find channel namespace and room name');
        }
        var ws = this.get('client');
        var packet = new Packet({
            type      : Packet.Type.Unsubscribe,
            namespace : this.get('namespace'),
            room      : this.get('room')
        });
        if (typeof callback === 'function') {
            packet.set('callback', function(response) {
                callback.call(channel, response);
                channel.emit('unsubscribed');
                ws.emit('unsubscribed', channel);
            });
        }
        this.emit('unsubscribe');
        ws.send(packet);
    };

    Channel.prototype.subscribed = function() {
        return this.get('subscribed') === true;
    };

    Channel.prototype.send = function(event, data, callback) {
        if (!this.subscribed()) {
            return this.log('channel is not subscribed');
        }
        if (typeof event !== 'string') {
            return this.log('channel event is missing');
        }
        var ws = this.get('client');
        var packet = new Packet({
            type      : Packet.Type.Channel,
            namespace : this.get('namespace'),
            room      : this.get('room')
        });
        var message = new Message({
            event     : event,
            data      : data
        });
        packet.set('message', message);
        if (typeof callback === 'function') {
            packet.set('callback', function(response) {
                callback.call(channel, response);
                channel.emit('message', response);
            });
        }
        ws.send(packet);
    };

    return Channel;

}.call(this || window));
