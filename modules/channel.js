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
        if (!this.get('client')) {
            return this.log('could not find websocket client');
        }
        if (typeof namespace !== 'string' || typeof room !== 'string) {
            return this.log('could not find channel namespace and room name');
        }
        var ws = this
            .get('client')
            .get('ws');
        var packet = new Sphere.Module.Packet({
            type      : Sphere.Module.Packet.Type.Subscribe,
            namespace : this.get('namespace'),
            room      : this.get('room'),
            callback  : function() {
                if (typeof callback === 'function') {
                    callback.call(this);
                }
                this.emit('subscribed');
            }.bind(this)
        });
        ws.send(packet);
    };

    Channel.prototype.unsubscribe = function(callback) {
        if (!this.get('client')) {
            return this.log('could not find websocket client');
        }
        if (typeof namespace !== 'string' || typeof room !== 'string) {
            return this.log('could not find channel namespace and room name');
        }
        var ws = this
            .get('client')
            .get('ws');
        var packet = new Sphere.Module.Packet({
            type      : Sphere.Module.Packet.Type.Unsubscribe,
            namespace : this.get('namespace'),
            room      : this.get('room'),
            callback  : function() {
                if (typeof callback === 'function') {
                    callback.call(this);
                }
                this.emit('subscribed');
            }.bind(this)
        });
        ws.send(packet);
    };

    Sphere.Module.Channel = Channel;

}.call(this || window));
