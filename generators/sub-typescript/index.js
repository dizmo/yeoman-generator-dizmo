'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const Generator = require('yeoman-generator');
const lodash = require('lodash');
const rimraf = require('rimraf');
const sort = require('../app/functions/sort');

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
                    '@typescript-eslint/eslint-plugin': '6.0.0',
                    '@typescript-eslint/parser': '6.0.0'
                })
            );
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'ts-loader': '^9.4.4',
                    'typescript': '^5.1.6'
                })
            );
            pkg.optionalDependencies = sort(
                lodash.assign(pkg.optionalDependencies, {
                    '@types/chai': '^4.3.5',
                    '@types/chai-spies': '^1.0.3',
                    '@types/mocha': '^10.0.1'
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
                    'typedoc': '^0.24.8'
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
        if (this.env && this.env.conflicter) {
            this.env.conflicter.force = this.options.force || upgrade;
        }
        if (this.env && this.env.conflicterOptions) {
            this.env.conflicterOptions.force = this.options.force || upgrade;
        }
    }
    async end() {
        await this._mov();
        await this._mig();
        await this._rim();
    }
    async _mov() {
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
    async _mig() {
        await require('../app/migrate')(this.destinationPath('source'), {
            include: /\.[j,t]s$/, exclude: /\.(umd|min)\.js$/
        });
        await require('../app/migrate')(this.destinationPath('test'), {
            include: /\.[j,t]s$/, exclude: /\.(umd|min)\.js$/
        });
    }
    async _rim() {
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
