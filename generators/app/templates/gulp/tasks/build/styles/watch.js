const gulp = require('gulp');

gulp.task('styles:watch', () =>
    gulp.watch('source/style/**/*.scss', gulp.series('styles'))
);
