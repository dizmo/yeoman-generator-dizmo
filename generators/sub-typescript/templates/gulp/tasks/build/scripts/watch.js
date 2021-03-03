const gulp = require('gulp');

gulp.task('scripts:watch', () =>
    gulp.watch('source/**/*.(js|ts|tsx)', gulp.series('scripts'))
);
