const cli = require('../../tools/cli.js');
const gulp = require('gulp');

const npm_outdated = (...args) => cli.run('npm', 'outdated', ...args)();
const npm_config = (...args) => cli.run('npm', 'config', ...args)({
    stdio: 'pipe'
});
const recheck = (key, delta=86400000) => async (now) => {
    const epoch = parseInt(await npm_config('get', `${key}:epoch`)) || 0;
    if (now - epoch > delta) {
        await npm_config('set', `${key}:epoch=${now}`);
        return true;
    }
    return false;
};
gulp.task('outdated', () => recheck('@dizmo/generator-dizmo')(Date.now())
    .then((run) => run && npm_outdated('yo', '@dizmo/generator-dizmo', '-g')));
