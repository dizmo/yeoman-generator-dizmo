let pkg = require('../../../package.js'),
    path = require('path');
let gulp = require('gulp'),
    gulp_util = require('gulp-util'),
    gulp_uglify = require('gulp-uglify'),
    gulp_sourcemaps = require('gulp-sourcemaps');
let buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    extend = require('xtend'),
    source = require('vinyl-source-stream'),
    through = require('through2'),
    watchify = require('watchify');

let watched = watchify(browserify({basedir: '.', entries: [
        'node_modules/babel-polyfill/lib/index.js', 'src/app/app.ts'
    ], cache: {}, packageCache: {}, debug: true
}).plugin(require('tsify')));

let gulp_obfuscator = function (opts) {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }
        if (file.isStream()) {
            return callback(new Error('streaming not supported', null));
        }
        let result = require('javascript-obfuscator').obfuscate(
            file.contents.toString(encoding), opts);
        file.contents = Buffer.from(
            result.getObfuscatedCode(), encoding);
        callback(null, file);
    });
};

let on_watch = function () {
    let cli_min = require('yargs')
        .default('minify')
        .argv.minify;

    let sourcemaps = false,
        obfuscate = cli_min === true,
        uglify = cli_min === true;

    if (pkg.dizmo && pkg.dizmo.build) {
        let cfg_min = pkg.dizmo.build.minify;
        if (cfg_min) {
            let cfg_ss = cfg_min.scripts !== undefined ? cfg_min.scripts : {};
            if (cfg_ss) {
                if (cfg_ss.sourcemaps) // by default w/o a source-map!
                {
                    sourcemaps = extend({loadMaps: true}, cfg_ss.sourcemaps);
                }
                if (cli_min === undefined && (
                    cfg_ss.obfuscate || cfg_ss.obfuscate === undefined))
                {
                    obfuscate = extend({}, cfg_ss.obfuscate);
                }
                if (cli_min === undefined && (
                    cfg_ss.uglify || cfg_ss.uglify === undefined))
                {
                    uglify = extend({}, cfg_ss.uglify);
                }
            }
        }
    }

    let argv = require('yargs')
        .default('sourcemaps', sourcemaps)
        .default('obfuscate', obfuscate)
        .default('uglify', uglify).argv;

    if (typeof argv.sourcemaps === 'string') {
        argv.sourcemaps = JSON.parse(argv.sourcemaps);
    }
    if (typeof argv.obfuscate === 'string') {
        argv.obfuscate = JSON.parse(argv.obfuscate);
    }
    if (typeof argv.uglify === 'string') {
        argv.uglify = JSON.parse(argv.uglify);
    }

    let stream = watched.bundle()
        .pipe(source('index.js')).pipe(buffer());
    if (argv.sourcemaps) {
        stream = stream.pipe(gulp_sourcemaps.init(
            extend({loadMaps: true}, argv.sourcemaps)
        ));
    }
    if (argv.obfuscate) {
        stream = stream.pipe(gulp_obfuscator.apply(
            this, extend({}, argv.obfuscate)
        ));
    }
    if (argv.uglify) {
        stream = stream.pipe(gulp_uglify.apply(
            this, extend({}, argv.uglify)
        ));
    }
    if (argv.sourcemaps) {
        stream = stream.pipe(gulp_sourcemaps.write(
            './'
        ));
    }
    stream = stream.pipe(gulp.dest(
        path.join('build', pkg.name)
    ));
    return stream;
};

watched.on('update', on_watch);
watched.on('log', gulp_util.log);
gulp.task('scripts:watch', on_watch);