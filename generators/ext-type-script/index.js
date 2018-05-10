'use strict';

let fs = require('fs'),
    Generator = require('yeoman-generator'),
    lodash = require('lodash'),
    rimraf = require('rimraf');

function sort(dictionary) {
    let array = [],
        sorted = {};

    for(let key in dictionary) {
        array[array.length] = key;
    }
    array.sort();

    for(let i = 0; i < array.length; i++) {
        sorted[array[i]] = dictionary[array[i]];
    }
    return sorted;
}

module.exports = class extends Generator {
    writing() {
        let upgrade = Boolean(
            this.options.upgrade && fs.existsSync('package.json'));
        if (!upgrade || upgrade) {
            this.fs.copy(
                this.templatePath('gulp/'),
                this.destinationPath('gulp/'));
        }
        if (!upgrade || upgrade) {
            let pkg = this.fs.readJSON(
                this.destinationPath('package.json')
            );
            delete pkg.devDependencies['babel-preset-env'];
            delete pkg.devDependencies['babelify'];
            delete pkg.devDependencies['gulp-eslint'];
            delete pkg['babel'];
            pkg.devDependencies = sort(
                lodash.assign(pkg.devDependencies, {
                    'gulp-tslint': '^8.1.3',
                    'tsify': '^4.0.0',
                    'tslint': '^5.9.1',
                    'typescript': '^2.8.1'
                })
            );
            this.fs.writeJSON(
                this.destinationPath('package.json'), pkg, null, 2);
        }
        if (!upgrade) {
            this.fs.copy(
                this.templatePath('src/'),
                this.destinationPath('src/'));
            this.fs.copy(
                this.templatePath('tslint.json'),
                this.destinationPath('tslint.json'));
            this.fs.copy(
                this.templatePath('tsconfig.json'),
                this.destinationPath('tsconfig.json'));
            this.fs.copy(
                this.templatePath('typings.json'),
                this.destinationPath('typings.json'));
        }
        this.conflicter.force = this.options.force || upgrade;
    }

    end() {
        rimraf.sync(
            this.destinationPath('.eslintrc.json'));
        rimraf.sync(
            this.destinationPath('src/index.js'));
    }
};
