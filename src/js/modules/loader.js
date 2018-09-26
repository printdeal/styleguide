var Core = (function (Core, settings, Loader) {
    "use strict";

    var config = settings && settings.modules && settings.modules.loader;
    var loadingText = config && config.text || "Loading";


    return Core.register("Loader", {
        setup: function () {Loader.setup(loadingText);},
        show: function () {Loader.show(loadingText);},
        hide: Loader.hide
    });
}(Core || {}, window.settings, LoaderModule || {})); // jshint ignore:line
