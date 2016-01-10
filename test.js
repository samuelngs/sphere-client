
;(function() {

    // global
    var global = this;

    websocket = new Sphere.Module.WebSocket("ws://localhost:4000/sync");

    websocket.on('open', function() {
        console.log('connection opened');
    });

    websocket.on('close', function() {
        console.log('connection closed');
    });

    websocket.on('message', function(packet) {
        console.log('message:', packet);
    });

}.call(window || this))
