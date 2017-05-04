var Core = (function (Core, settings) {
    "use strict";

    var $element;
    var config = settings && settings.modules && settings.modules.loader;
    var loadingText = config && config.text || "Loading";

    var show = function (text) {
        $element
            .attr("data-text", (text || loadingText))
            .addClass("Loader--IsActive");
    };

    var hide = function () {
        $element.removeClass("Loader--IsActive");
    };

    var setup = function () {
        var $loader = $("#Loader");

        if ($loader.length) {
            $element = $loader;
        } else {
            $element = $("<div>")
                .addClass("Loader")
                .attr("id", "Loader")
                .attr("data-text", loadingText)
                .appendTo("body");
        }
    };

    return Core.register("Loader", {
        setup: setup,
        show: show,
        hide: hide
    });
}(Core || {}, window.settings));
