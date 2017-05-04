var gulp = require("gulp"),
    config = require(process.cwd() + "/tasks/config.json"),
    plugins = require("gulp-load-plugins")();

gulp.task("js:report:todo", function () {
    return gulp.src([
            config.paths.js.src + "**/*.js",
            "!" + config.paths.js.src + "vendor/**/*",
            "gulpfile.js",
            "./tasks/**/*.js"
        ])
        .pipe(plugins.todo({
            verbose: true
        }));
});
