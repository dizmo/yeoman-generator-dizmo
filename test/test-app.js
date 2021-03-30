const assert = require('yeoman-assert');
const { run } = require('yeoman-test');
const { join } = require('path');

describe('generator-dizmo:app', function () {
    const generator = join(__dirname, '../generators/app');
    it('yo @dizmo/dizmo', () => {
        return run(generator).withOptions({
            'author': 'Dizmo Developer',
            'bundle-id': 'com.dizmo.my_dizmo',
            'email': 'developer@dizmo.com'
        }).then(() => {
            assert.file([
                'assets',
                'assets/Icon-dark.svg',
                'assets/Icon.svg',
                'assets/locales',
                'assets/locales/translation.de.json',
                'assets/locales/translation.en.json',
                'assets/Preview.png',
                'gulp',
                'gulp/package.js',
                'gulp/tasks',
                'gulp/tasks/build',
                'gulp/tasks/build/assets',
                'gulp/tasks/build/assets/index.js',
                'gulp/tasks/build/assets/watch.js',
                'gulp/tasks/build/dizmo',
                'gulp/tasks/build/dizmo/index.js',
                'gulp/tasks/build/dizmo/watch.js',
                'gulp/tasks/build/help',
                'gulp/tasks/build/help/index.js',
                'gulp/tasks/build/help/watch.js',
                'gulp/tasks/build/index.js',
                'gulp/tasks/build/libraries',
                'gulp/tasks/build/libraries/index.js',
                'gulp/tasks/build/libraries/watch.js',
                'gulp/tasks/build/markup',
                'gulp/tasks/build/markup/index.js',
                'gulp/tasks/build/markup/watch.js',
                'gulp/tasks/build/properties',
                'gulp/tasks/build/properties/index.js',
                'gulp/tasks/build/properties/watch.js',
                'gulp/tasks/build/scripts',
                'gulp/tasks/build/scripts/index.js',
                'gulp/tasks/build/scripts/watch.js',
                'gulp/tasks/build/styles',
                'gulp/tasks/build/styles/index.js',
                'gulp/tasks/build/styles/watch.js',
                'gulp/tasks/build/watch.js',
                'gulp/tasks/clean',
                'gulp/tasks/clean/index.js',
                'gulp/tasks/deploy',
                'gulp/tasks/deploy/index.js',
                'gulp/tasks/deploy/watch.js',
                'gulp/tasks/document',
                'gulp/tasks/document/index.js',
                'gulp/tasks/document/watch.js',
                'gulp/tasks/lint',
                'gulp/tasks/lint/index.js',
                'gulp/tasks/upload',
                'gulp/tasks/upload/index.js',
                'gulp/tasks/watch',
                'gulp/tasks/watch/index.js',
                'gulp/tools',
                'gulp/tools/cli.js',
                'gulp/tools/cli-spinner.js',
                'gulp/tools/run-task.js',
                'gulpfile.js',
                'help',
                'help/en',
                'help/en/help.md',
                'help/en/placeholder-400x275.png',
                'jsdoc.json',
                'LICENSE',
                'package.json',
                'README.md',
                'source',
                'source/index.html',
                'source/index.js',
                'source/lib',
                'source/lib/i18n-2.1.0.min.js',
                'source/lib/i18n-2.1.0.min.js.map',
                'source/styles',
                'source/styles/styles.scss',
                'test',
                'test/test.js',
                'webpack.config.js',
                'webpack.config.test.js',
                '.eslintrc.json',
                '.info.plist',
                '.npmignore',
                '.travis.yml',
                '.yo-rc.json',
            ]);
            assert.jsonFileContent('package.json', {
                'name': 'MyDizmo',
                'description': 'My Dizmo',
                'version': '0.0.0',
                'author': {
                    'name': 'Dizmo Developer',
                    'email': 'developer@dizmo.com'
                },
                'contributors': [
                    {
                        'name': 'Dizmo Developer',
                        'email': 'developer@dizmo.com'
                    }
                ],
                'dizmo': {
                    'settings': {
                        'attributes': {
                            'settings/usercontrols/allowresize': true
                        },
                        'bundle-identifier': 'com.dizmo.my_dizmo',
                        'bundle-name': 'MyDizmo',
                        'category': '',
                        'height': 360,
                        'tags': [
                            'my-dizmo'
                        ],
                        'width': 480
                    },
                    'store': {
                        'host': 'https://store-api.dizmo.com'
                    }
                },
                'dependencies': {
                    '@babel/polyfill': '^7.12.1',
                    '@dizmo/dizmo.js': '^1.4.29'
                },
                'devDependencies': {
                    '@babel/core': '^7.13.14',
                    '@babel/preset-env': '^7.13.12',
                    'ansi-colors': '^4.1.1',
                    'babel-loader': '^8.2.2',
                    'css-loader': '^5.2.0',
                    'eslint': '^7.23.0',
                    'fancy-log': '^1.3.3',
                    'gulp': '^4.0.2',
                    'gulp-copy': '^4.0.1',
                    'gulp-dart-sass': '^1.0.2',
                    'gulp-eslint': '^6.0.0',
                    'gulp-htmlmin': '^5.0.1',
                    'gulp-plist': '^0.9.0',
                    'gulp-rename': '^2.0.0',
                    'gulp-replace': '^1.0.0',
                    'gulp-sourcemaps': '^3.0.0',
                    'gulp-ver': '^0.1.0',
                    'gulp-zip': '^5.1.0',
                    'request': '^2.88.2',
                    'rimraf': '^3.0.2',
                    'sass': '^1.32.8',
                    'sass-loader': '^11.0.1',
                    'style-loader': '^2.0.0',
                    'webpack': '^5.28.0',
                    'webpack-stream': '^6.1.2',
                    'yargs': '^16.2.0'
                },
                'optionalDependencies': {
                    'chai': '^4.3.4',
                    'chai-spies': '^1.0.0',
                    'ignore-styles': '^5.0.1',
                    'javascript-obfuscator': '^2.11.0',
                    'jsdoc': '^3.6.6',
                    'jsdom': '^16.5.2',
                    'jsdom-global': '^3.0.2',
                    'minami': '^1.2.3',
                    'mocha': '^8.3.2',
                    'pump': '^3.0.0',
                    'webpack-cli': '^4.6.0',
                    'webpack-obfuscator': '^3.3.0'
                },
                'license': 'ISC',
                'private': true,
                'repository': {
                    'type': 'git',
                    'url': ''
                },
                'scripts': {
                    'build': 'node ./gulp/tools/run-task.js',
                    'clean': 'node ./gulp/tools/run-task.js clean',
                    'deploy': 'node ./gulp/tools/run-task.js deploy',
                    'docs': 'node ./gulp/tools/run-task.js docs',
                    'lint': 'node ./gulp/tools/run-task.js lint',
                    'test': 'node ./gulp/tools/run-task.js test',
                    'upload': 'node ./gulp/tools/run-task.js upload',
                    'watch': 'node ./gulp/tools/run-task.js watch'
                }
            });
        });
    });
    it('yo @dizmo/dizmo --git', () => {
        return run(generator).withOptions({
            'author': 'Dizmo Developer',
            'bundle-id': 'com.dizmo.my_dizmo',
            'email': 'developer@dizmo.com',
            'git': true
        }).then(() => {
            assert.file([
                '.gitignore'
            ]);
            assert.noFile([
                '.npmignore'
            ]);
        });
    });
});
