var Core = (function (Core, $) {
    "use strict";

    /**
     * Used css selectors
     *
     * @type {object}
     * @private
     */
    var _cssClasses = {
            triggerClose: ".js-feedback-close",
            feedback: ".Feedback"
        },

        /**
         * Setup this module
         */
        setup = function () {
            $(document).on("click",_cssClasses.triggerClose, close);
        },

        /**
         * Close the feedback
         */
        close = function () {
            var trigger = $(this),
                feedback = trigger.closest(_cssClasses.feedback);

            if (feedback) {
                feedback.remove();
            }
        };

    return Core.register("Feedback", {
        setup: setup
    });
}(Core || {}, window.jQuery));
