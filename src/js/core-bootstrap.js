var Core = (function (Core) {
    "use strict";

    var module;
    var html;

    // Run all modules from a single for-loop
    for (module in Core) {
        // Check if modules exist and if they have a setup method
        if (Core.hasOwnProperty(module) && Core[module].hasOwnProperty("setup")) {
            Core[module].setup();
        }
    }

    /*****************************************************************
     * GENERAL METHODS USED THROUGHOUT SITE                          *
     ****************************************************************/

    // Add user agent string to HTML so it can be used as a CSS hook
    html = document.documentElement;
    html.setAttribute("data-useragent", navigator.userAgent);
    html.setAttribute("data-platform", navigator.platform);

    return Core;

}(Core || {}));
