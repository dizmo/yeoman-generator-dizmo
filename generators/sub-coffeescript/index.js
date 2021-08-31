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
                    'coffee-loader': '^3.0.0',
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
        this.env.conflicter.force = this.options.force || upgrade;
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
    async _mig() {
        const rx = (method) => {
            return new RegExp(`(dizmo|bundle|viewer)\.${method}`, 'g');
        };
        const rx_private = (method) => {
            return new RegExp(`(dizmo|bundle|viewer)\.privateStorage\.${method}`, 'g');
        };
        await walk(this.destinationPath('source'), (filepath) => {
            const script = fs
                .readFileSync(this.destinationPath(filepath), 'utf8')
                // unsubscriptions
                .replace(rx('unsubscribeRemoteHost'), '$1.unsubscribe')
                .replace(rx('unsubscribeParentChange'), '$1.unsubscribe')
                .replace(rx('unsubscribeChildren'), '$1.unsubscribe')
                .replace(rx('unsubscribeDizmoChanged'), '$1.unsubscribe')
                .replace(rx('unsubscribeBundleChanged'), '$1.unsubscribe')
                // attributes
                .replace(rx('getAttribute'), '$1.getAttribute')
                .replace(rx('setAttribute'), '$1.setAttribute')
                .replace(rx('deleteAttribute'), '$1.deleteAttribute')
                .replace(rx('subscribeToAttribute'), '$1.onAttribute')
                .replace(rx('subscribeToAttributeConditional'), '$1.onAttributeIf')
                .replace(rx('unsubscribeAttribute'), '$1.unsubscribe')
                .replace(rx('beginAttributeUpdate'), '$1.beginAttributeUpdate')
                .replace(rx('endAttributeUpdate'), '$1.endAttributeUpdate')
                .replace(rx('cacheAttribute'), '$1.cacheAttribute')
                .replace(rx('uncacheAttribute'), '$1.uncacheAttribute')
                // private properties
                .replace(rx_private('getProperty'), '$1.getProperty')
                .replace(rx_private('setProperty'), '$1.setProperty')
                .replace(rx_private('deleteProperty'), '$1.deleteProperty')
                .replace(rx_private('subscribeToProperty'), '$1.onProperty')
                .replace(rx_private('unsubscribeProperty'), '$1.unsubscribe')
                .replace(rx_private('beginPropertyUpdate'), '$1.beginPropertyUpdate')
                .replace(rx_private('endPropertyUpdate'), '$1.endPropertyUpdate')
                .replace(rx_private('cacheProperty'), '$1.cacheProperty')
                .replace(rx_private('uncacheProperty'), '$1.uncacheProperty');
            fs.writeFileSync(
                this.destinationPath(filepath), script
            );
        });
    }
    async _rim() {
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
const walk = async (
    base, callback, options = {
        include: /\.coffee$/,
        exclude: undefined
    }
) => {
    const { access, readdir, lstat } = require('fs').promises;
    const { join } = require('path');
    try {
        await access(base);
    } catch (ex) {
        return false;
    }
    for (const filename of await readdir(
        base
    )) {
        const subpath = join(base, filename);
        const stat = await lstat(subpath);
        if (stat.isDirectory()) {
            return await walk(subpath, callback, options)
        }
        if (options?.include && !filename.match(
            options?.include
        )) {
            continue;
        }
        if (options?.exclude && filename.match(
            options?.exclude
        )) {
            continue;
        }
        await callback(subpath);
    }
    return true;
};
