var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var spawn = require('child_process').spawn;

const outputPath = 'dist';
const paths = ["lib/**/*.js"]
const configPaths = ['.babelrc', 'package.json'];
gulp.task("compile", function () {
  return gulp.src(paths, { base: './' })
    .pipe(sourcemaps.init())
    .pipe(babel())
    .on('error', function (error) {
      console.log(error);
      this.emit('end');
    })
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(outputPath))
    ;
  }
);
gulp.task("watch", function () {
  return gulp.watch(paths.concat(configPaths), ['compile']);
});

gulp.task("default", ['compile', 'watch']);
