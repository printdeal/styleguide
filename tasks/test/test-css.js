var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();

gulp.task("css:test:lint", function () {
    return gulp.src("src/css/**/*.scss")
        .pipe(plugins.stylelint({
            reporters: [{formatter: "string", console: true}]
        }));
});

gulp.task("css:test", ["css:test:lint"]);
