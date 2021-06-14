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
            this.fs.copy(
                this.templatePath('_eslintrc.json'),
                this.destinationPath('.eslintrc.json')
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
                    r.loader.indexOf('ts-loader') >= 0 ||
                    typeof r.loader === 'string' &&
                    r.loader.match(/ts-loader/)
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
                    r.loader.indexOf('ts-loader') >= 0 ||
                    typeof r.loader === 'string' &&
                    r.loader.match(/ts-loader/)
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
                    '@typescript-eslint/eslint-plugin': '4.26.1',
                    '@typescript-eslint/parser': '4.26.1'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'ts-loader': '^9.2.3',
                    'typescript': '^4.3.2'
                })
            );
            pkg.optionalDependencies = sort(
                lodash.assign(pkg.optionalDependencies, {
                    '@types/chai': '^4.2.18',
                    '@types/chai-spies': '^1.0.3',
                    '@types/mocha': '^8.2.2'
                })
            );
            if (pkg.devDependencies['gulp-tslint']) {
                delete pkg.devDependencies['gulp-tslint'];
            }
            if (pkg.devDependencies['tslint']) {
                delete pkg.devDependencies['tslint'];
            }
            this.fs.writeJSON(pkg_path, pkg, null, 2);
        }
        if (!upgrade || upgrade) {
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            pkg.optionalDependencies = sort(
                lodash.assign(pkg.optionalDependencies, {
                    'typedoc': '^0.20.36'
                })
            );
            if (pkg.optionalDependencies['jsdoc']) {
                delete pkg.optionalDependencies['jsdoc'];
            }
            if (pkg.optionalDependencies['minami']) {
                delete pkg.optionalDependencies['minami'];
            }
            this.fs.writeJSON(pkg_path, pkg, null, 2);
        }
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('typedoc.json'),
                this.destinationPath('typedoc.json')
            );
        }
        if (!upgrade || upgrade) {
            const pkg_path = this.destinationPath('package.json');
            const pkg = this.fs.readJSON(pkg_path);
            this.fs.copy(
                this.templatePath('test/'),
                this.destinationPath('test/')
            );
            this.fs.copyTpl(
                this.templatePath('test/test.ts'),
                this.destinationPath('test/test.ts'), {
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
                this.templatePath('tsconfig.json'),
                this.destinationPath('tsconfig.json')
            );
        }
        this.env.conflicter.force = this.options.force || upgrade;
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
            this.destinationPath('source/index.ts')
        )) {
            const script = fs
                .readFileSync(this.destinationPath('source/index.ts'), 'utf8')
                .replace(/window/g, 'global');
            fs.writeFileSync(
                this.destinationPath('source/index.ts'), script
            );
        }
    }
    _rim() {
        rimraf.sync(
            this.destinationPath('jsdoc.json')
        );
        rimraf.sync(
            this.destinationPath('tslint.json')
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
