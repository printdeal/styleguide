var gulp = require("gulp");
var config = require(process.cwd() + "/tasks/config.json");
var plugins = require("gulp-load-plugins")();
var gutil = plugins.util;
var del = require("del");

var cleanFolder = function (folderName) {
    return del(
        [config.styleguideAssetsDir + folderName + "/*"],
        {"force": true},
        function (err, files) {
            gutil.log(
                gutil.colors.cyan("styleguide:clean " + folderName),
                "deleted",
                plugins.util.colors.magenta(files.length),
                "files"
            );
        }
    );
};

// Cleanup tasks
gulp.task("styleguide:clean:css", function () {
    cleanFolder("css");
});

gulp.task("styleguide:clean:js", function () {
    cleanFolder("js");
});

gulp.task("styleguide:clean:fonts", function () {
    cleanFolder("fonts");
});

gulp.task("styleguide:clean:img", function () {
    cleanFolder("img");
});

//Copy assets to styleguide tasks
gulp.task("styleguide:css", ["styleguide:clean:css"], function () {
    gulp.src([
        config.paths.css.test + "printdeal-styleguide.css",
        config.paths.css.test + "printdeal-styleguide.min.css"
    ]).pipe(gulp.dest(config.styleguideAssetsDir + "css"));
});

gulp.task("styleguide:js", ["styleguide:clean:js"], function () {
    gulp.src([
        config.paths.js.test + "**/*"
    ]).pipe(gulp.dest(config.styleguideAssetsDir + "js"));
});

gulp.task("styleguide:fonts", ["styleguide:clean:fonts"], function () {
    gulp.src([
        config.paths.fonts.test + "**/*"
    ]).pipe(gulp.dest(config.styleguideAssetsDir + "fonts"));
});

gulp.task("styleguide:img", ["styleguide:clean:img"], function () {
    gulp.src([
        config.paths.img.test + "**/*"
    ]).pipe(gulp.dest(config.styleguideAssetsDir + "img"));
});

// styleguide all assets
gulp.task("styleguide", [
    "styleguide:css",
    "styleguide:js",
    "styleguide:fonts",
    "styleguide:img"
]);
