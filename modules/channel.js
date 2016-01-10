;(function() {

    var global = this;

    var Channel = function Channel(options) {
        Sphere.Core.Base.call(this, options);

        // option      | type
        // -----------------------------
        // namespace   | string
        // room        | string
        // client      | object

        // defaults and states
        this.set('subscribed', false);
    };

    Channel.prototype = Object.create(Sphere.Core.Base.prototype);
    Channel.prototype.constructor = Channel;

    Channel.prototype.subscribe = function(callback) {
        var channel = this;
        if (!this.get('client')) {
            return this.log('could not find websocket client');
        }
        if (typeof this.get('namespace') !== 'string' || typeof this.get('room') !== 'string') {
            return this.log('could not find channel namespace and room name');
        }
        var ws = this.get('client');
        var packet = new Sphere.Module.Packet({
            type      : Sphere.Module.Packet.Type.Subscribe,
            namespace : this.get('namespace'),
            room      : this.get('room')
        });
        if (typeof callback === 'function') {
            packet.set('callback', function(response) {
                callback.call(channel, response);
                channel.emit('subscribed');
            });
            ws.callback(packet);
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
        var packet = new Sphere.Module.Packet({
            type      : Sphere.Module.Packet.Type.Unsubscribe,
            namespace : this.get('namespace'),
            room      : this.get('room')
        });
        if (typeof callback === 'function') {
            packet.set('callback', function(response) {
                callback.call(channel, response);
                channel.emit('unsubscribed');
            });
            ws.callback(packet);
        }
        this.emit('unsubscribe');
        ws.send(packet);
    };

    Channel.prototype.subscribed = function() {
        return this.get('subscribed') === true;
    };

    Sphere.Module.Channel = Channel;

}.call(this || window));
