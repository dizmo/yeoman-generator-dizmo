const { npx } = require('../../tools/cli');
const pkg = require('../../package.js');
const gulp = require('gulp');

gulp.task(
    'test:build', () => npx('webpack',
        '--config', 'webpack.config.test.js',
        '--stats', 'errors-only'
    ).catch(process.exit)
);
gulp.task(
    'test:run', () => npx('mocha',
        '--require', 'jsdom-global/register',
        '--require', 'ignore-styles',
        `build/${pkg.name}.test`,
        '--recursive'
    ).catch(process.exit)
);
gulp.task('test', gulp.series(
    'clean', 'test:build', 'test:run'
));
