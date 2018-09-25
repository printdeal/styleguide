"use strict";

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

exports.loaderModule = {
    show: show,
    hide: hide,
    setup: setup
};
