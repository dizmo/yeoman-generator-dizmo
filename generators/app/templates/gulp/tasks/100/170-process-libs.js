let pkg = require('../../package.js'),
    path = require('path'),
    gulp = require('gulp');

gulp.task('process-libs', function (done) {
    return require('../../miscellanea/pipe')([
        gulp.src(['src/lib/**/*'], {base: 'src'}),
        gulp.dest(path.join('build', pkg.name))
    ], done);
});
