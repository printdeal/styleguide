var Core = (function (Core) {
    "use strict";

    var panel = ".Panel",
        collapsable = "Panel--IsCollapsable",
        collapsed = "Panel--IsCollapsed";

    var close = function () {
        $(this)
            .closest(panel)
            .removeClass(collapsable)
            .addClass(collapsed);
    };

    var open = function () {
        $(this)
            .closest(panel)
            .removeClass(collapsed)
            .addClass(collapsable);
    };

    var setup = function () {
        $(document)
            .on("click", ".Panel--IsCollapsable .Panel__Header", close)
            .on("click", ".Panel--IsCollapsed .Panel__Header", open);
    };

    return Core.register("Panel", {
        setup: setup
    });
}(Core || {}));
