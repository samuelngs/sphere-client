;(function() {

    var global = this;

    var WebSocket = function WebSocket(url, options) {
        Sphere.Core.Base.call(this, options);
        // props
        this.set('url', url);
        this.set('channels', {});
        this.set('callbacks', {});
        // state
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
        console.log('open');
        this.set('connected', true);
    };

    WebSocket.prototype._onclose = function() {
        console.log('close');
    };

    WebSocket.prototype._onmessage = function(msg) {
        console.log('message:', msg);
    };

    Sphere.Module.WebSocket = WebSocket;

}.call(this || window));

