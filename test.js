
;(function() {

    // global
    var global = this;

    websocket = new Sphere.Module.WebSocket("ws://localhost:4000/sync");

}.call(window || this))
