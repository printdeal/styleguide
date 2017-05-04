/**
 * @namespace CoreSettings
 * @memberof  Core
 */
var Core = (function () {
    "use strict";

    var /**
         * The default animation duration
         *
         * @memberof! Core.CoreSettings
         * @name ANIMATION_DURATION
         * @type {number}
         * @public
         */
        ANIMATION_DURATION = 150;

    return Core.register("Settings", {
        ANIMATION_DURATION: ANIMATION_DURATION
    });
}(Core || {}));
