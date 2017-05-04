var Core = (function (Core) {
    "use strict";

    var gallery = ".js-gallery",
        thumb = ".js-gallery-thumb",
        featured = ".js-gallery-featured",
        srcAttr = "data-large",
        thumbActiveClass = "Gallery__Thumb--IsActive",

        initialize = function () {
            $(gallery).each(function () {
                $(this).find(thumb).first().addClass(thumbActiveClass);
            });
        },

        stateChanged = function () {
            var $thumb = $(this),
                $gallery = $thumb.closest(gallery),
                $featured = $gallery.find(featured);

            $gallery.find("." + thumbActiveClass).removeClass(thumbActiveClass);
            $thumb.addClass(thumbActiveClass);
            $featured.attr("src", $thumb.attr(srcAttr));
        },

        setup = function () {
            initialize();
            $(document).on("mouseover click focus", thumb, stateChanged);
        };

    return Core.register("Gallery", {
        setup: setup
    });
}(Core || {}));
