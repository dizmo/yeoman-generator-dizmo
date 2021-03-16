'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const Generator = require('yeoman-generator');
const lodash = require('lodash');
const rimraf = require('rimraf');

module.exports = class extends Generator {
    writing() {
        const upgrade = Boolean(
            this.options.upgrade && fs.existsSync('package.json')
        );
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('gulp/'),
                this.destinationPath('gulp/')
            );
        }
        if (!upgrade || upgrade) {
            const tpl_path = this.templatePath('webpack.config.js');
            const dst_path = this.destinationPath('webpack.config.js');
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            try {
                const config = require(dst_path) || {};
                const module = config.module || {};
                const rules = module.rules || [];
                if (!rules.find((r) =>
                    typeof r.loader === 'object' &&
                    r.loader.indexOf('coffee-loader') >= 0 ||
                    typeof r.loader === 'string' &&
                    r.loader.match(/coffee-loader/)
                )) {
                    this.fs.copyTpl(tpl_path, dst_path, {
                        dizmoName: pkg.name
                    });
                }
            } catch (ex) {
                this.fs.copyTpl(tpl_path, dst_path, {
                    dizmoName: pkg.name
                });
            }
        }
        if (!upgrade || upgrade) {
            const tpl_path = this.templatePath('webpack.config.test.js');
            const dst_path = this.destinationPath('webpack.config.test.js');
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            try {
                const config = require(dst_path) || {};
                const module = config.module || {};
                const rules = module.rules || [];
                if (!rules.find((r) =>
                    typeof r.loader === 'object' &&
                    r.loader.indexOf('coffee-loader') >= 0 ||
                    typeof r.loader === 'string' &&
                    r.loader.match(/coffee-loader/)
                )) {
                    this.fs.copyTpl(tpl_path, dst_path, {
                        dizmoName: pkg.name
                    });
                }
            } catch (ex) {
                this.fs.copyTpl(tpl_path, dst_path, {
                    dizmoName: pkg.name
                });
            }
        }
        if (!upgrade || upgrade) {
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'coffee-loader': '^2.0.0',
                    'coffeescript': '^2.5.1',
                    'gulp-coffeelint': '^0.6.0'
                })
            );
            pkg.optionalDependencies = sort(
                lodash.assign(pkg.optionalDependencies, {
                    'tmp': '^0.2.1'
                })
            );
            if (pkg.devDependencies['gulp-eslint']) {
                delete pkg.devDependencies['gulp-eslint'];
            }
            this.fs.writeJSON(pkg_path, pkg, null, 2);
        }
        if (!upgrade || upgrade) {
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            this.fs.copy(
                this.templatePath('test/'),
                this.destinationPath('test/')
            );
            this.fs.copyTpl(
                this.templatePath('test/test.coffee'),
                this.destinationPath('test/test.coffee'), {
                    dizmoName: pkg.name
                }
            );
        }
        if (!upgrade) {
            this.fs.copy(
                this.templatePath('source/'),
                this.destinationPath('source/')
            );
            this.fs.copy(
                this.templatePath('coffeelint.json'),
                this.destinationPath('coffeelint.json')
            );
        }
        this.conflicter.force = this.options.force || upgrade;
    }
    end() {
        this._mov();
        this._rim();
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
            this.destinationPath('source/index.coffee')
        )) {
            const script = fs
                .readFileSync(this.destinationPath('source/index.coffee'), 'utf8')
                .replace(/window/g, 'global');
            fs.writeFileSync(
                this.destinationPath('source/index.coffee'), script
            );
        }
    }
    _rim() {
        rimraf.sync(
            this.destinationPath('.eslintrc.json')
        );
        rimraf.sync(
            this.destinationPath('source/index.js')
        );
        rimraf.sync(
            this.destinationPath('test/test.js')
        );
    }
};
function sort(object) {
    return Object.entries(object).sort().reduce(
        (a, [k, v]) => { a[k] = v; return a; }, {}
    );
}
