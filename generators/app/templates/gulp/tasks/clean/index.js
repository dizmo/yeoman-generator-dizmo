const gulp = require('gulp');
const { rimraf } = require('rimraf');

gulp.task('clean', () => rimraf('build'));
