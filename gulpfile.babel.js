import gulp from 'gulp';
import babel from 'gulp-babel';
import gutil from 'gulp-util';

const paths = {
  src: "src/*.js",
  dest: "lib"
};

gulp.task("default", ["build"]);

gulp.task("build", () => {
  return gulp.src(paths.src)
             .pipe(babel().on("error", gutil.log))
             .pipe(gulp.dest(paths.dest));
});

gulp.task("watch", ["build"], () => {
  return gulp.watch([paths.src], ['build'])
});
