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

    Sphere.Module.Message = Message;

}.call(this || window));
