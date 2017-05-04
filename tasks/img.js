/* jshint -W079 */
var gulp = require("gulp");
var config = require(process.cwd() + "/tasks/config.json");
var plugins = require("gulp-load-plugins")();
var merge = require("merge-stream");
var gutil = plugins.util;
var path = config.paths.img;
var del = require("del");
var _ = require("lodash");
var imageminPngquant = require("imagemin-pngquant");
var s3Settings = {
    uploadPath: config.aws.paths.img,
    headers: config.aws.headers
};
var runSequence = require("run-sequence");

gulp.task("img:clean", function () {
    return del([path.dist, path.tmp]).then(function (paths) {
        if (paths.length) {
            return gutil.log("Deleted", paths.length, "files");
        }

        gutil.log("Nothing to delete");
    });
});

gulp.task("img:sprites", function () {
    var iconDimension = 12;
    var getConfig = function (theme) {
        return {
            shape: {
                dimension: {
                    maxWidth: iconDimension,
                    maxHeight: iconDimension
                }
            },
            mode: {
                css: {
                    sprite: "sprite-" + theme.skin.prefix + theme.name + ".svg",
                    render: {
                        scss: {
                            template: "./src/css/skins/printdeal/objects/_sprite.scss.mustache", // jshint ignore:line
                            dest: "_sprite.scss"
                        }
                    },
                    bust: false
                }
            },
            variables: {
                iconDimension: iconDimension
            }
        };
    };

    var spriteThemes = [];

    _.forEach(config.paths.css.skins, function (skin) {
        _.forEach(skin.themes, function (theme) {
            spriteThemes.push({
                skin: skin,
                icons: theme.icons,
                name: theme.name
            });
        });
    });

    var spriters = _.map(spriteThemes, function (theme) {
        if (!theme) {
            return;
        }

        var filterSass = plugins.filter(["*.scss"], { restore: true });
        var filterSvg = plugins.filter(["*.svg"], { restore: true });
        var scssPath = "./src/css/skins/" + theme.skin.name + "/themes/" + theme.name + "/objects"; // jshint ignore:line

        return gulp.src(path.src + "icons/" + theme.icons + "/**/*.svg")
            .pipe(plugins.svgSprite(getConfig(theme)))
            .pipe(plugins.flatten())
            .pipe(filterSass)
            .pipe(gulp.dest(scssPath))
            .pipe(filterSass.restore)
            .pipe(filterSvg)
            .pipe(gulp.dest(path.tmp))
            .pipe(plugins.svg2png({
                width: 400 // arbitrary width, change as needed
            }))
            .pipe(plugins.rename({ extname: ".png" }))
            .pipe(imageminPngquant(config.settings.imageminPngquant)())
            .pipe(gulp.dest(path.tmp));
    });

    return merge(spriters);
});

gulp.task("img:copy", function () {
    var filterSvg = plugins.filter(["*.svg"], { restore: true });
    var filterPng = plugins.filter(["*.png"], { restore: true });
    return gulp.src([
            path.src + "*.png",
            path.src + "*.jpg",
            path.src + "*.gif",
            path.src + "*.svg"
        ])
        .pipe(filterSvg)
        .pipe(plugins.svgmin((config.settings.svgmin)))
        .pipe(gulp.dest(path.tmp))
        .pipe(plugins.svg2png())
        .pipe(imageminPngquant(config.settings.imageminPngquant)())
        .pipe(gulp.dest(path.tmp))
        .pipe(filterSvg.restore)
        .pipe(filterPng)
        .pipe(imageminPngquant(config.settings.imageminPngquant)())
        .pipe(filterPng.restore)
        .pipe(gulp.dest(path.tmp));
});

gulp.task("img:rev", function () {
    return gulp.src(path.tmp + "*")
        .pipe(plugins.rev())
        .pipe(gulp.dest(path.dist))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest(path.dist));
});

// Workaround task to release all images, except SVG's
gulp.task("img:release:nosvg", function () {
    return gulp.src([
        "./dist/img/*.png",
        "./dist/img/*.jpg",
        "./dist/img/*.gif"
    ])
    .pipe(plugins.s3(config.aws.settings, s3Settings));
});

// Release all images
gulp.task("img:release", ["img:release:nosvg"], function () {
    return gulp.src("./dist/img/*.svg")
        .pipe(plugins.gzip())
        .pipe(plugins.s3(config.aws.settings, _.merge(s3Settings, {
            gzippedOnly: true
        })));
});

gulp.task("img", function (callback) {
    runSequence("img:copy", "img:sprites", "img:rev", "img:release", callback);
});
