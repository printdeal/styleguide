/* jshint -W079 */
var gulp = require("gulp");
var config = require(process.cwd() + "/tasks/config.json");
var plugins = require("gulp-load-plugins")();
var gutil = plugins.util;
var path = config.paths.fonts;
var del = require("del");
var _ = require("lodash");
var runSequence = require("run-sequence");

gulp.task("fonts:clean", function () {
    return del([path.tmp + "*", path.dist + "*"]).then(function (paths) {
        if (paths.length) {
            return gutil.log("Deleted", paths.length, "files");
        }

        gutil.log("Nothing to delete");
    });
});

gulp.task("fonts:rev", function () {
    return gulp.src([
            path.src + "**/*.ttf",
            path.src + "**/*.woff",
            path.src + "**/*.woff2"
        ])
        .pipe(gulp.dest(path.tmp))
        .pipe(plugins.rev())
        .pipe(gulp.dest(path.dist))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(path.dist));
});

gulp.task("fonts:release", function () {
    var filterWoff2 = plugins.filter(["**/*.woff2"]);
    var woff2headers = _.assign(config.aws.headers, {
        "Content-Type": "application/font-woff2"
    });

    return gulp.src([
            path.dist + "**/*.ttf",
            path.dist + "**/*.woff",
            path.dist + "**/*.woff2"
        ])
        .pipe(plugins.s3(config.aws.settings, {
            uploadPath: config.aws.paths.fonts,
            headers: config.aws.headers
        }))
        .pipe(filterWoff2)
        .pipe(plugins.s3(config.aws.settings, {
            uploadPath: config.aws.paths.fonts,
            headers: woff2headers
        }));
});

gulp.task("fonts", function (callback) {
    runSequence("fonts:clean", "fonts:rev", callback);
});
