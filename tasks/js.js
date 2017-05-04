var gulp = require("gulp");
var config = require(process.cwd() + "/tasks/config.json");
var pkg = require(process.cwd() + "/package.json");
var plugins = require("gulp-load-plugins")();
var del = require("del");
var path = config.paths.js;
var gutil = plugins.util;
var runSequence = require("run-sequence");

gulp.task("js:clean", function () {
    return del([path.dist + "*.js", path.tmp + "*.js"]).then(function (paths) {
        if (paths.length) {
            return gutil.log("Deleted", paths.length, "files");
        }

        gutil.log("Nothing to delete");
    });
});

gulp.task("js:min", function () {
    return gulp.src([
            path.src + "utils.js",
            path.src + "vendor/**/*.js",
            path.src + "core.js",
            path.src + "core-settings.js",
            path.src + "modules/**/*.js",
            path.src + "core-bootstrap.js"
        ])
        .pipe(plugins.concat("printdeal.js"))
        .pipe(plugins.header(config.file.banner, { pkg: pkg }))
        .pipe(gulp.dest(path.tmp))
        .pipe(gulp.dest(path.dist))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(plugins.header(config.file.banner, { pkg: pkg }))
        .pipe(gulp.dest(path.dist));
});

gulp.task("js:release", function () {
    return gulp.src(path.dist + "*.js")
        .pipe(plugins.rename(function (path) {
            var parts = path.basename.split(".min"),
                suffix = "-" + pkg.version;

            if (parts.length > 1) {
                path.basename = parts[0] + suffix + ".min";
            } else {
                path.basename += suffix;
            }
        }))
        .pipe(gulp.dest(path.dist))
        .pipe(plugins.gzip())
        .pipe(plugins.s3(config.aws.settings, {
            uploadPath: config.aws.paths.js,
            gzippedOnly: true,
            headers: config.aws.headers
        }));
});

gulp.task("js", function () {
    runSequence("js:test", "js:clean", "js:min");
});
