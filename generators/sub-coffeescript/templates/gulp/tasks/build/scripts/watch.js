const gulp = require('gulp');

gulp.task('scripts:watch', () =>
    gulp.watch('source/**/*.(coffee|js)', gulp.series('scripts'))
);
