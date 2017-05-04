var gulp = require("gulp"),
    config = require(process.cwd() + "/tasks/config.json"),
    plugins = require("gulp-load-plugins")();

var testFiles = [
        config.paths.js.src + "**/*.js",
        "!" + config.paths.js.src + "vendor/**/*",
        "gulpfile.js",
        config.paths.tasks + "**/*.js"
    ];

gulp.task("js:test:jshint", function () {
    var jshint = plugins.jshint;

    return gulp.src(testFiles)
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"))
        .pipe(jshint.reporter("fail"));
});

gulp.task("js:test:jscs", function () {
    return gulp.src(testFiles)
        .pipe(plugins.jscs(".jscsrc"));
});

gulp.task("js:test:jsonlint", function () {
    return gulp.src([
            "./package.json",
            ".src/**/*.json"
        ])
        .pipe(plugins.jsonlint())
        .pipe(plugins.jsonlint.reporter());
});

gulp.task("js:test:cpd", function () {
    return gulp.src([
            config.paths.js.src + "**/*.js",
            "!" + config.paths.js.src + "vendor/**/*"
        ])
        .pipe(plugins.jscpd());
});

gulp.task("js:test", ["js:test:jshint", "js:test:jsonlint", "js:test:cpd"]);
