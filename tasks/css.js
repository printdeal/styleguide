/* jshint -W079 */
var gulp = require("gulp");
var pkg = require(process.cwd() + "/package.json");
var config = require(process.cwd() + "/tasks/config.json");
var plugins = require("gulp-load-plugins")();
var del = require("del");
var lazypipe = require("lazypipe");
var gutil = plugins.util;
var path = config.paths.css;
var _ = require("lodash");
var runSequence = require("run-sequence");

gulp.task("css:clean", function () {
    return del([path.tmp + "*.css", path.dist + "*.css"]).then(function (paths) {
        if (paths.length) {
            return gutil.log("Deleted", paths.length, "files");
        }

        gutil.log("Nothing to delete");
    });
});

var cdnifyCss = lazypipe()
    .pipe(function () {
        var curDir = process.cwd() + "/",
            manifest = "rev-manifest.json",
            imgsManifest = require(curDir + config.paths.img.dist + manifest),
            fontsManifest = require(curDir + config.paths.fonts.dist + manifest),
            s3Paths = config.aws.paths,
            replaceThis = [],
            replaceUrls = function (manifest, path) {
                _.forIn(manifest, function (rev, asset) {
                    replaceThis.push([
                        "\"" + asset + "\"",
                        "\"" + config.aws.url + path + manifest[asset] + "\"" // jshint ignore:line
                    ]);
                });
            };

        replaceUrls(imgsManifest, s3Paths.img);
        replaceUrls(fontsManifest, s3Paths.fonts);

        return plugins.batchReplace(replaceThis);
    });

gulp.task("css:sass", function () {
    var themeHookFiles = [];

    _.forEach(path.skins, function (skin) {
        themeHookFiles.push(skin.themes.map(function (theme) {
            return skin.folder + "themes/" + theme.name + "/" + skin.prefix + theme.name + ".scss"; // jshint ignore:line
        }));
    });

    return gulp.src(_.flatten(themeHookFiles))
        .pipe(plugins.sass().on("error", plugins.sass.logError))
        .pipe(plugins.autoprefixer(config.settings.autoprefixer))
        .pipe(plugins.header(config.file.banner, { pkg: pkg }))
        .pipe(cdnifyCss())
        .pipe(gulp.dest(path.tmp));
});

// All cleanCss options via
// https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically
//
// advanced: false makes sure that duplicate properties like background-
// position for `select` will both be output in the minified CSS.
gulp.task("css:min", function () {
    return gulp.src([path.tmp + "*.css", path.src + "**/*.css"])
        .pipe(plugins.flatten())
        .pipe(plugins.cleanCss({
            advanced: false
        }))
        .pipe(plugins.rename({ suffix: ".min" }))
        .pipe(gulp.dest(path.dist));
});

gulp.task("css:debug", function () {
    return gulp.src(path.src + "skins/printdeal/debug/debug.scss")
        .pipe(plugins.sass().on("error", plugins.sass.logError))
        .pipe(gulp.dest(path.tmp));
});

gulp.task("css:release", function () {
    return gulp.src(path.dist + "*.css")
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
            uploadPath: config.aws.paths.css,
            gzippedOnly: true,
            headers: config.aws.headers
        }));
});

gulp.task("css", function (callback) {
    runSequence("css:test", "css:clean", "css:sass", "css:min", callback);
});
