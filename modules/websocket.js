;(function() {

    var global = this;

    var WebSocket = function WebSocket(url, options) {
        Sphere.Core.Base.call(this, options);
        // props
        this.set('url', url);
        this.set('channels', {});
        this.set('callbacks', {});
        // state
        this.set('cid', 0);
        this.set('listened', false);
        this.set('connected', false);
        // events
        this._create();
        this._keepalive();
    };

    WebSocket.prototype = Object.create(Sphere.Core.Base.prototype);
    WebSocket.prototype.constructor = WebSocket;

    WebSocket.prototype._keepalive = function() {
        setInterval(function() {
            if (!this.get('connected')) {
                this._create();
            }
        }.bind(this), 2500);
    };

    WebSocket.prototype._create = function() {
        var ws  = this.get('ws'),
            url = this.get('url');
        if (typeof url === 'string' && !this.get('connected')) {
            this._cleanup();
            this.set('ws', new global.WebSocket(url));
            this._listen();
        }
    };

    WebSocket.prototype._cleanup = function() {
        var ws = this.get('ws');
        if (typeof ws !== 'undefined' && ws instanceof global.WebSocket) {
            ws.removeEventListener('open', this._onopen.bind(this));
            ws.removeEventListener('close', this._onclose.bind(this));
            ws.removeEventListener('message', this._onmessage.bind(this));
            this.set('cid', 0);
            this.set('connected', false);
            this.set('listened', false);
            this.unset('ws');
        }
    };

    WebSocket.prototype._listen = function() {
        if (!this.get('listened')) {
            this.set('listened', true);
            var ws = this.get('ws');
            ws.addEventListener('open', this._onopen.bind(this));
            ws.addEventListener('close', this._onclose.bind(this));
            ws.addEventListener('message', this._onmessage.bind(this));
        }
    };

    WebSocket.prototype._onopen = function() {
        this.set('connected', true);
        this.emit('open');
    };

    WebSocket.prototype._onclose = function() {
        this.set('connected', false);
        this.emit('close');
    };

    WebSocket.prototype._onmessage = function(msg) {
        // creates packet
        var packet = new Sphere.Module.Packet();
        // parse data and return packet
        packet.parse(msg);
        // receive event
        this.emit('message', packet);
    };

    WebSocket.prototype.send = function(packet) {
        if (!(packet instanceof Sphere.Module.Packet)) {
            return this.log('packet is invalid');
        }
        packet.set('cid', this.get('cid'));
        this.get('ws').send(packet.json());
        this.append('cid', 1);
    };

    WebSocket.prototype.subscribe = function(namespace, room, callback) {
        var channel = this.channel(namespace, room, true);
        if (channel) {
            channel.subscribe(callback);
        }
    };

    WebSocket.prototype.unsubscribe = function(namespace, room, callback) {
        var channel = this.channel(namespace, room, true);
        if (channel) {
            channel.unsubscribe(callback);
        }
    };

    WebSocket.prototype.channel = function(namespace, room, autoCreate) {
        var channel;
        if (typeof autoCreate !== 'boolean') {
            autoCreate = false;
        }
        if (typeof namespace !== 'string') {
            return this.log('please provide the channel namespace');
        }
        if (typeof room !== 'string') {
            return this.log('please provide the channel room name');
        }
        if (typeof this.get('channels')[namespace] !== 'object') {
            this.get('channels')[namespace] = {};
        }
        if (typeof this.get('channels')[namespace][room] === 'object') {
            channel = this.get('channels')[namespace][room];
        } else {
            if (autoCreate === true) {
                channel = new Sphere.Module.Channel({
                    client    : this,
                    namespace : namespace,
                    room      : room
                });
                this.get('channels')[namespace][room] = channel;
            }
        }
        return channel;
    };

    WebSocket.prototype.channels = function(onlySubscribed) {
        var channels = [];
        var namespaces = Object.keys(this.get('channels'));
        if (typeof onlySubscribed !== 'boolean') {
            onlySubscribed = false;
        }
        for (var i = 0; i < namespaces.length; i++) {
            var namespace = namespaces[i],
                rooms     = Object.keys(namespace);
            for (var j = 0; j < rooms.length; j++) {
                var channel = rooms[j];
                if ((onlySubscribed && channel.subscribed()) || !onlySubscribed) {
                    channels.push(channel);
                }
            }
        }
        return channels;
    };

    Sphere.Module.WebSocket = WebSocket;

}.call(this || window));

