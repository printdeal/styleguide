;(function (window, Math) {
    "use strict";

    var _u = {};

    // Generate a random string
    var randomString = function () {
        return Math.random().toString(36).substring(7);
    };

    _u.KEYS = {
        "ESC": 27
    };

    // Export utils to window
    window._u = _u;
    window.randomString = randomString;

}(this, Math));
