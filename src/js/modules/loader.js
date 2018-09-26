var domElement;

var show = function (text) {
    domElement.setAttribute("data-text", (text));
    domElement.classList.add("Loader--IsActive");
};

var hide = function () {
    domElement.classList.remove("Loader--IsActive");
};

var setup = function (loadingText) {
    var $loader = document.getElementById("Loader");

    if ($loader) {
        domElement = $loader;
    } else {
        var newLoaderElement = document.createElement("div");
        newLoaderElement.classList.add("Loader");
        newLoaderElement.setAttribute("id", "Loader");
        newLoaderElement.setAttribute("data-text", loadingText);
        document.body.appendChild(newLoaderElement);

        domElement = newLoaderElement;
    }
};

var LoaderModule = {
    show: show,
    hide: hide,
    setup: setup
};

var Core = (function (Core, settings, Loader) {

    var config = settings && settings.modules && settings.modules.loader;
    var loadingText = config && config.text || "Loading";


    return Core.register("Loader", {
        setup: function () {Loader.setup(loadingText);},
        show: function () {Loader.show(loadingText);},
        hide: Loader.hide
    });
}(Core || {}, window.settings, LoaderModule));

if(typeof module === "object" && module.exports){
    module.exports = {
        LoaderModule: LoaderModule
    };
}
