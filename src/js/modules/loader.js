var Core = (function (Core, settings) {
    "use strict";

    var domElement;
    var config = settings && settings.modules && settings.modules.loader;
    var loadingText = config && config.text || "Loading";

    var show = function (text) {
        domElement.setAttribute("data-text", (text || loadingText));
        domElement.classList.add('Loader--IsActive');
    };

    var hide = function () {
        domElement.classList.remove('Loader--IsActive');
    };

    var setup = function () {
        var $loader = document.getElementById('Loader');

        if ($loader) {
            domElement = $loader;
        } else {
            var newLoaderElement = document.createElement('div');
            newLoaderElement.classList.add('Loader');
            newLoaderElement.setAttribute('id', 'Loader');
            newLoaderElement.setAttribute('data-text', loadingText);
            document.body.appendChild(newLoaderElement);

            domElement = newLoaderElement;
        }
    };

    return Core.register("Loader", {
        setup: setup,
        show: show,
        hide: hide
    });
}(Core || {}, window.settings));
