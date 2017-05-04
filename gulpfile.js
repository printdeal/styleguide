var gulp = require("gulp");
var config = require("./tasks/config.json");
var requireDir = require("require-dir");
var plugins = require("gulp-load-plugins")();
var gutil = plugins.util;
var runSequence = require("run-sequence");

// Require all sub-tasks so we have them available in this master file
requireDir(config.paths.tasks, { recurse: true });

// Global task to run all tests
gulp.task("test", ["css:test", "js:test"]);

gulp.task("build", function (callback) {
    runSequence(
        ["test"],
        "fonts",
        "img",
        "css",
        "js",
        callback);
});

// Watch files for changes and act upon those changes
gulp.task("watch", function () {
    var paths = config.paths;
    var clrs = gutil.colors;

    var onChange = function (event) {
        gutil.log(
            "File",
            clrs.magenta(event.path.replace(new RegExp("/.*(?=/)/"), "")),
            "was",
            clrs.cyan(event.type)
        );
    };

    gulp.watch(paths.css.src + "**/*.scss", function () {
        runSequence("css:clean", "css:sass", "css:min", "styleguide:css");
    }).on("change", onChange);

    gulp.watch(paths.js.src + "**/*.js", function () {
        runSequence("js:min", "styleguide:js");
    }).on("change", onChange);

    gulp.watch(paths.img.src + "**/*", ["images"])
    .on("change", onChange);

    gulp.watch(paths.fonts.src + "**/*", function () {
        runSequence("fonts", "styleguide:fonts");
    }).on("change", onChange);
});

// Watch files simply calling `gulp`
gulp.task("default", ["watch"]);
