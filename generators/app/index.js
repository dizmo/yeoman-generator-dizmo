'use strict';

const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const Generator = require('yeoman-generator');
const lodash = require('lodash');
const os = require('os');
const path = require('path');
const process = require('process');
const shell = require('shelljs');
const rimraf = require('rimraf');
const yosay = require('yosay');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.argument('name', {
            defaults: 'MyDizmo',
            required: false,
            type: String
        });
        this.option('description', {
            desc: 'Short one-liner describing the dizmo',
            type: String
        });
        this.option('bundle-id', {
            desc: 'Bundle identifier in reverse domain notation',
            type: String
        });
        this.option('author', {
            defaults: this.user.git.name() || process.env.USER,
            desc: 'Name of the author',
            type: String
        });
        this.option('email', {
            defaults: this.user.git.email() || process.env.MAIL,
            desc: 'Email of the author',
            type: String
        });
        this.option('git', {
            defaults: false,
            desc: 'GIT repository initialization',
            type: Boolean
        });
        this.option('coffeescript', {
            alias: 'coffee-script',
            defaults: false,
            desc: 'Sub-generator with CoffeeScript',
            type: Boolean
        });
        this.option('typescript', {
            alias: 'type-script',
            defaults: false,
            desc: 'Sub-generator with TypeScript',
            type: Boolean
        });
        this.option('upgrade', {
            defaults: false,
            desc: 'Upgrade the build system',
            type: Boolean
        });
    }
    prompting() {
        const self = this;
        const prompts = [];
        const pkg = fs.existsSync('package.json')
            ? JSON.parse(fs.readFileSync('package.json'))
            : {};
        this.log(yosay(
            'Welcome to the awesome {0} generator!'.replace(
                '{0}', chalk.green.bold('dizmo')
            )
        ));
        prompts.push({
            type: 'input',
            name: 'dizmoName',
            message: 'Name your dizmo:',
            default: function () {
                if (pkg && pkg.name) {
                    return pkg.name;
                }
                return lodash.upperFirst(
                    lodash.camelCase(self.options['name'])
                );
            },
            when: function (prop) {
                if (pkg && pkg.name) {
                    if (!pkg.name.match(/\s/)) {
                        prop.dizmoName = pkg.name;
                        return false;
                    }
                }
                if (self.args.length > 0) {
                    if (!self.args[0].match(/\s/)) {
                        prop.dizmoName = self.args[0];
                        return false;
                    }
                }
                return true;
            },
            validate: function (value) {
                return !value.match(/\s/);
            }
        });
        prompts.push({
            type: 'input',
            name: 'dizmoDescription',
            message: 'Describe it:',
            default: function (prop) {
                if (pkg && pkg.description) {
                    return pkg.description;
                }
                return self.dizmoDescription
                    || lodash.startCase(prop.dizmoName);
            },
            when: function (prop) {
                if (pkg && pkg.description) {
                    prop.dizmoDescription = pkg.description;
                    return false;
                }
                if (self.options['description']) {
                    prop.dizmoDescription = self.options['description'];
                    return false;
                }
                return true;
            }
        });
        prompts.push({
            type: 'input',
            name: 'bundleId',
            message: 'And its bundle ID?',
            default: function (prop) {
                if (pkg && pkg.dizmo && pkg.dizmo.settings &&
                    pkg.dizmo.settings['bundle-identifier']
                ) {
                    return pkg.dizmo.settings['bundle-identifier'];
                }
                const domain =
                    self.config.get('domain') || self._domain();
                const bundle_id =
                    `${domain}.${lodash.snakeCase(prop.dizmoName)}`;
                return self.bundleId || bundle_id;
            },
            when: function (prop) {
                if (pkg && pkg.dizmo && pkg.dizmo.settings &&
                    pkg.dizmo.settings['bundle-identifier']
                ) {
                    prop.bundleId = pkg.dizmo.settings['bundle-identifier'];
                    return false;
                }
                if (self.options['bundle-id']) {
                    prop.bundleId = self.options['bundle-id'];
                    return false;
                }
                return true;
            }
        });
        prompts.push({
            store: true,
            type: 'input',
            name: 'personName',
            message: 'What\'s your name?',
            default: function () {
                if (pkg && pkg.person && pkg.person.name) {
                    return pkg.person.name;
                }
                return self.personName;
            },
            when: function (prop) {
                if (pkg && pkg.person && pkg.person.name) {
                    prop.personName = pkg.person.name;
                    return false;
                }
                if (self.options['author']) {
                    prop.personName = self.options['author'];
                    return false;
                }
                return true;
            }
        });
        prompts.push({
            store: true,
            type: 'input',
            name: 'personEmail',
            message: 'And your email?',
            default: function () {
                if (pkg && pkg.person && pkg.person.email) {
                    return pkg.person.email;
                }
                return self.personEmail;
            },
            when: function (prop) {
                if (pkg && pkg.person && pkg.person.email) {
                    prop.personEmail = pkg.person.email;
                    return false;
                }
                if (self.options['email']) {
                    prop.personEmail = self.options['email'];
                    return false;
                }
                return true;
            }
        });
        return this.prompt(prompts).then(function (prop) {
            if (prop.dizmoName === undefined) {
                if (pkg && pkg.name) {
                    prop.dizmoName = pkg.name;
                } else {
                    prop.dizmoName = self.options['name'];
                }
            }
            if (prop.dizmoDescription === undefined) {
                if (pkg && pkg.description) {
                    prop.dizmoDescription = pkg.description;
                } else {
                    prop.dizmoDescription = self.options['description'];
                }
            }
            if (prop.bundleId === undefined) {
                if (pkg && pkg.dizmo && pkg.dizmo.settings &&
                    pkg.dizmo.settings['bundle-identifier']
                ) {
                    prop.bundleId = pkg.dizmo.settings['bundle-identifier'];
                } else {
                    prop.bundleId = self.options['bundle-id'];
                }
            }
            if (prop.personName === undefined) {
                if (pkg && pkg.person && pkg.person.name) {
                    prop.personName = pkg.person.name;
                } else {
                    prop.personName = self.options['author'];
                }
            }
            if (prop.personEmail === undefined) {
                if (pkg && pkg.person && pkg.person.email) {
                    prop.personEmail = pkg.person.email;
                } else {
                    prop.personEmail = self.options['email'];
                }
            }
            self.properties = lodash.assign(prop, {
                _: lodash
            });
        });
    }
    configuring() {
        const bundle_id = path.parse(this.properties.bundleId);
        if (bundle_id && bundle_id.name) {
            this.config.set('domain', bundle_id.name);
        } else {
            this.config.set('domain', this._domain());
        }
        if (fs.existsSync('package.json')) {
            this.destinationRoot(process.cwd());
        } else {
            if (this.options['git']) {
                this.destinationRoot(
                    lodash.kebabCase(this.properties.dizmoName) + '.git');
            } else {
                this.destinationRoot(
                    lodash.kebabCase(this.properties.dizmoName));
            }
            this.properties.initial = true;
        }
        this.config.save();
    }
    writing() {
        const upgrade = Boolean(
            this.options.upgrade && fs.existsSync('package.json')
        );
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('gulp/'),
                this.destinationPath('gulp/')
            );
            this.fs.copy(
                this.templatePath('gulpfile.js'),
                this.destinationPath('gulpfile.js')
            );
        }
        if (!upgrade || upgrade) {
            if (!this.fs.exists(this.destinationPath(
                'webpack.config.js'
            ))) {
                this.fs.copyTpl(
                    this.templatePath('webpack.config.js'),
                    this.destinationPath('webpack.config.js'),
                    this.properties
                );
            }
        }
        if (!upgrade || upgrade) {
            if (!this.fs.exists(this.destinationPath(
                'webpack.config.test.js'
            ))) {
                this.fs.copyTpl(
                    this.templatePath('webpack.config.test.js'),
                    this.destinationPath('webpack.config.test.js'),
                    this.properties
                );
            }
        }
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('jsdoc.json'),
                this.destinationPath('jsdoc.json')
            );
        }
        if (!upgrade) {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                this.properties
            );
        }
        if (!upgrade || upgrade) {
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            pkg.dependencies = sort(
                lodash.assign(pkg.dependencies, {
                    '@babel/polyfill': '^7.12.1',
                    '@dizmo/dizmo.js': '^1.4.33'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    '@babel/core': '^7.13.15',
                    '@babel/preset-env': '^7.13.15'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'babel-loader': '^8.2.2',
                    'css-loader': '^5.2.1',
                    'sass': '^1.32.8',
                    'sass-loader': '^11.0.1',
                    'style-loader': '^2.0.0',
                    'webpack': '^5.31.2',
                    'webpack-stream': '^6.1.2'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'gulp': '^4.0.2',
                    'gulp-copy': '^4.0.1',
                    'gulp-eslint': '^6.0.0',
                    'gulp-htmlmin': '^5.0.1',
                    'gulp-plist': '^0.9.0',
                    'gulp-rename': '^2.0.0',
                    'gulp-replace': '^1.0.0',
                    'gulp-dart-sass': '^1.0.2',
                    'gulp-sourcemaps': '^3.0.0',
                    'gulp-zip': '^5.1.0'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'ansi-colors': '^4.1.1',
                    'eslint': '^7.24.0',
                    'fancy-log': '^1.3.3',
                    'request': '^2.88.2',
                    'rimraf': '^3.0.2',
                    'yargs': '^16.2.0'
                })
            );
            pkg.optionalDependencies = sort(
                lodash.assign(pkg.optionalDependencies, {
                    'chai': '^4.3.4',
                    'chai-spies': '^1.0.0',
                    'ignore-styles': '^5.0.1',
                    'javascript-obfuscator': '^2.11.1',
                    'jsdoc': '^3.6.6',
                    'jsdom': '^16.5.3',
                    'jsdom-global': '^3.0.2',
                    'minami': '^1.2.3',
                    'mocha': '^8.3.2',
                    'pump': '^3.0.0',
                    'webpack-cli': '^4.6.0',
                    'webpack-obfuscator': '^3.3.0'
                })
            );
            if (pkg.optionalDependencies['closure-webpack-plugin']) {
                delete pkg.optionalDependencies['closure-webpack-plugin'];
            }
            if (pkg.optionalDependencies['google-closure-compiler']) {
                delete pkg.optionalDependencies['google-closure-compiler'];
            }
            pkg.scripts = sort(
                lodash.assign(pkg.scripts, {
                    'build': 'node ./gulp/tools/run-task.js',
                    'clean': 'node ./gulp/tools/run-task.js clean',
                    'deploy': 'node ./gulp/tools/run-task.js deploy',
                    'docs': 'node ./gulp/tools/run-task.js docs',
                    'lint': 'node ./gulp/tools/run-task.js lint',
                    'test': 'node ./gulp/tools/run-task.js test',
                    'upload': 'node ./gulp/tools/run-task.js upload',
                    'watch': 'node ./gulp/tools/run-task.js watch'
                })
            );
            this.fs.writeJSON(pkg_path, pkg, null, 2);
        }
        if (!upgrade) {
            this.fs.copy(
                this.templatePath('assets/'),
                this.destinationPath('assets/')
            );
            this.fs.copy(
                this.templatePath('help/**/*.png'),
                this.destinationPath('help/')
            );
            this.fs.copyTpl(
                this.templatePath('help/**/*.md'),
                this.destinationPath('help/'),
                this.properties
            );
            this.fs.copy(
                this.templatePath('source/'),
                this.destinationPath('source/')
            );
            this.fs.copyTpl(
                this.templatePath('source/index.html'),
                this.destinationPath('source/index.html'),
                this.properties
            );
            this.fs.copy(
                this.templatePath('_eslintrc.json'),
                this.destinationPath('.eslintrc.json')
            );
            this.fs.copy(
                this.templatePath('_info.plist'),
                this.destinationPath('.info.plist')
            );
            this.fs.copyTpl(
                this.templatePath('LICENSE'),
                this.destinationPath('LICENSE'), lodash.assign(
                    this.properties, { year: new Date().getFullYear() }
                )
            );
            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath('README.md'),
                this.properties
            );
        }
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('test/'),
                this.destinationPath('test/')
            );
            this.fs.copyTpl(
                this.templatePath('test/test.js'),
                this.destinationPath('test/test.js'),
                this.properties
            );
            this.fs.copy(
                this.templatePath('_travis.yml'),
                this.destinationPath('.travis.yml')
            );
        }
        if (!upgrade || upgrade) {
            if (this.options.git || fs.existsSync('.gitignore')) {
                this.fs.copy(
                    this.templatePath('_npmignore'),
                    this.destinationPath('.gitignore')
                );
            } else {
                this.fs.copy(
                    this.templatePath('_npmignore'),
                    this.destinationPath('.npmignore')
                );
            }
        }
        this.conflicter.force = upgrade;
    }
    end() {
        const pkg = this.fs.readJSON(
            this.destinationPath('package.json')
        );
        if (this.options.upgrade && pkg.devDependencies['coffeescript'] ||
            this.options['coffeescript']
        ) {
            this.composeWith(
                require.resolve('../sub-coffeescript'),
                lodash.assign(this.options, {
                    args: this.args, force: this.properties.initial
                })
            );
        } else if (
            this.options.upgrade && pkg.devDependencies['typescript'] ||
            this.options['typescript']
        ) {
            this.composeWith(
                require.resolve('../sub-typescript'),
                lodash.assign(this.options, {
                    args: this.args, force: this.properties.initial
                })
            );
        } else {
            console.log(
                '\nSetting the project root at:', this.destinationPath());
        }
        this._mov();
        this._rim();
        this._git();
    }
    _mov() {
        if (fs.existsSync(
            this.destinationPath('src')
        ) && !fs.existsSync(
            this.destinationPath('source')
        )) {
            fse.moveSync(
                this.destinationPath('src'),
                this.destinationPath('source')
            );
        }
        if (fs.existsSync(
            this.destinationPath('source/index.js')
        )) {
            const script = fs
                .readFileSync(this.destinationPath('source/index.js'), 'utf8')
                .replace(/window/g, 'global');
            fs.writeFileSync(
                this.destinationPath('source/index.js'), script
            );
        }
        if (fs.existsSync(
            this.destinationPath('source/index.html')
        )) {
            const html = fs
                .readFileSync(this.destinationPath('source/index.html'), 'utf8')
                .replace(/lib\/i18n-\d.\d.\d.min.js/, 'lib/i18n-2.1.0.min.js')
                .replace(/style\/style.css/, 'styles/styles.css');
            fs.writeFileSync(
                this.destinationPath('source/index.html'), html
            );
        }
        if (fs.existsSync(
            this.destinationPath('webpack.config.js')
        )) {
            const config = fs
                .readFileSync(this.destinationPath('webpack.config.js'), 'utf8')
                .replace(/src\/index/, 'source/index');
            fs.writeFileSync(
                this.destinationPath('webpack.config.js'), config
            );
        }
        if (fs.existsSync(
            this.destinationPath('source/style')
        ) && !fs.existsSync(
            this.destinationPath('source/styles')
        )) {
            fs.renameSync(
                this.destinationPath('source/style'),
                this.destinationPath('source/styles')
            );
        }
        if (fs.existsSync(
            this.destinationPath('source/styles/style.scss')
        ) && !fs.existsSync(
            this.destinationPath('source/styles/styles.scss')
        )) {
            fs.renameSync(
                this.destinationPath('source/styles/style.scss'),
                this.destinationPath('source/styles/styles.scss')
            );
        }
    }
    _rim() {
        rimraf.sync(
            this.destinationPath('node_modules')
        );
    }
    _git() {
        const git = shell.which('git');
        if (git && this.options.git) {
            this.spawnCommand(git.toString(), [
                'init', '--quiet', this.destinationPath()
            ]);
        }
    }
    _domain() {
        if (process.env.USER) {
            return 'me.' + process.env.USER;
        } else if (process.env.USERNAME) {
            return 'me.' + process.env.USERNAME;
        } else try {
            const base = path.parse(os.homedir()).base;
            if (base) {
                return 'me.' + base;
            } else {
                return 'my.domain';
            }
        } catch (_) {
            return 'my.domain';
        }
    }
};
function sort(object) {
    return Object.entries(object).sort().reduce(
        (a, [k, v]) => { a[k] = v; return a; }, {}
    );
}
