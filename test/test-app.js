const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const { join } = require("path");

describe("generator-dizmo:app", function () {
    const generator = join(__dirname, "../generators/app");
    it("yo @dizmo/dizmo", () => {
        return helpers.run(generator).withOptions({
            "author": "Dizmo Developer",
            "bundle-id": "com.dizmo.my_dizmo",
            "email": "developer@dizmo.com"
        }).then(() => {
            assert.file([
                "my-dizmo",
                "my-dizmo/assets",
                "my-dizmo/assets/Icon-dark.svg",
                "my-dizmo/assets/Icon.svg",
                "my-dizmo/assets/locales",
                "my-dizmo/assets/locales/translation.de.json",
                "my-dizmo/assets/locales/translation.en.json",
                "my-dizmo/assets/Preview.png",
                "my-dizmo/gulp",
                "my-dizmo/gulp/package.js",
                "my-dizmo/gulp/tasks",
                "my-dizmo/gulp/tasks/build",
                "my-dizmo/gulp/tasks/build/assets",
                "my-dizmo/gulp/tasks/build/assets/index.js",
                "my-dizmo/gulp/tasks/build/assets/watch.js",
                "my-dizmo/gulp/tasks/build/dizmo",
                "my-dizmo/gulp/tasks/build/dizmo/index.js",
                "my-dizmo/gulp/tasks/build/dizmo/watch.js",
                "my-dizmo/gulp/tasks/build/help",
                "my-dizmo/gulp/tasks/build/help/index.js",
                "my-dizmo/gulp/tasks/build/help/watch.js",
                "my-dizmo/gulp/tasks/build/index.js",
                "my-dizmo/gulp/tasks/build/libraries",
                "my-dizmo/gulp/tasks/build/libraries/index.js",
                "my-dizmo/gulp/tasks/build/libraries/watch.js",
                "my-dizmo/gulp/tasks/build/markup",
                "my-dizmo/gulp/tasks/build/markup/index.js",
                "my-dizmo/gulp/tasks/build/markup/watch.js",
                "my-dizmo/gulp/tasks/build/properties",
                "my-dizmo/gulp/tasks/build/properties/index.js",
                "my-dizmo/gulp/tasks/build/properties/watch.js",
                "my-dizmo/gulp/tasks/build/scripts",
                "my-dizmo/gulp/tasks/build/scripts/index.js",
                "my-dizmo/gulp/tasks/build/scripts/watch.js",
                "my-dizmo/gulp/tasks/build/styles",
                "my-dizmo/gulp/tasks/build/styles/index.js",
                "my-dizmo/gulp/tasks/build/styles/watch.js",
                "my-dizmo/gulp/tasks/build/watch.js",
                "my-dizmo/gulp/tasks/clean",
                "my-dizmo/gulp/tasks/clean/index.js",
                "my-dizmo/gulp/tasks/deploy",
                "my-dizmo/gulp/tasks/deploy/index.js",
                "my-dizmo/gulp/tasks/deploy/watch.js",
                "my-dizmo/gulp/tasks/document",
                "my-dizmo/gulp/tasks/document/index.js",
                "my-dizmo/gulp/tasks/document/watch.js",
                "my-dizmo/gulp/tasks/lint",
                "my-dizmo/gulp/tasks/lint/index.js",
                "my-dizmo/gulp/tasks/prebuild",
                "my-dizmo/gulp/tasks/prebuild/index.js",
                "my-dizmo/gulp/tasks/test",
                "my-dizmo/gulp/tasks/test/index.js",
                "my-dizmo/gulp/tasks/upgrade-check",
                "my-dizmo/gulp/tasks/upgrade-check/index.js",
                "my-dizmo/gulp/tasks/upload",
                "my-dizmo/gulp/tasks/upload/index.js",
                "my-dizmo/gulp/tasks/version-check",
                "my-dizmo/gulp/tasks/version-check/index.js",
                "my-dizmo/gulp/tasks/watch",
                "my-dizmo/gulp/tasks/watch/index.js",
                "my-dizmo/gulp/tools",
                "my-dizmo/gulp/tools/cli.js",
                "my-dizmo/gulp/tools/cli-spinner.js",
                "my-dizmo/gulp/tools/run-task.js",
                "my-dizmo/gulpfile.js",
                "my-dizmo/help",
                "my-dizmo/help/en",
                "my-dizmo/help/en/help.md",
                "my-dizmo/help/en/placeholder-400x275.png",
                "my-dizmo/jsdoc.json",
                "my-dizmo/LICENSE",
                "my-dizmo/package.json",
                "my-dizmo/README.md",
                "my-dizmo/source",
                "my-dizmo/source/index.html",
                "my-dizmo/source/index.js",
                "my-dizmo/source/lib",
                "my-dizmo/source/lib/i18n-2.1.0.min.js",
                "my-dizmo/source/lib/i18n-2.1.0.min.js.map",
                "my-dizmo/source/styles",
                "my-dizmo/source/styles/styles.scss",
                "my-dizmo/test",
                "my-dizmo/test/test.js",
                "my-dizmo/webpack.config.js",
                "my-dizmo/webpack.config.test.js",
            ]);
            assert.jsonFileContent("my-dizmo/package.json", {
                "name": "MyDizmo",
                "description": "My Dizmo",
                "version": "0.0.0",
                "author": {
                    "name": "Dizmo Developer",
                    "email": "developer@dizmo.com"
                },
                "contributors": [
                    {
                        "name": "Dizmo Developer",
                        "email": "developer@dizmo.com"
                    }
                ],
                "dizmo": {
                    "settings": {
                        "attributes": {
                            "settings/usercontrols/allowresize": true
                        },
                        "bundle-identifier": "com.dizmo.my_dizmo",
                        "bundle-name": "MyDizmo",
                        "category": "",
                        "height": 360,
                        "tags": [
                            "my-dizmo"
                        ],
                        "width": 480
                    },
                    "store": {
                        "host": "https://store-api.dizmo.com"
                    }
                },
                "dependencies": {
                    "@dizmo/dizmo.js": "^1.4.74",
                    "core-js": "^3.31.1",
                    "regenerator-runtime": "^0.13.11"
                },
                "devDependencies": {
                    "@babel/core": "^7.22.9",
                    "@babel/preset-env": "^7.22.9",
                    "ansi-colors": "^4.1.3",
                    "babel-loader": "^8.3.0",
                    "css-loader": "^6.8.1",
                    "eslint": "^8.45.0",
                    "fancy-log": "^2.0.0",
                    "gulp": "^4.0.2",
                    "gulp-copy": "^4.0.1",
                    "gulp-dart-sass": "^1.1.0",
                    "gulp-eslint": "^6.0.0",
                    "gulp-htmlmin": "^5.0.1",
                    "gulp-plist": "^0.9.0",
                    "gulp-rename": "^2.0.0",
                    "gulp-replace": "^1.1.4",
                    "gulp-sourcemaps": "^3.0.0",
                    "gulp-zip": "^5.1.0",
                    "rimraf": "^5.0.1",
                    "sass": "^1.63.6",
                    "sass-loader": "^13.3.2",
                    "style-loader": "^3.3.3",
                    "webpack": "^5.88.1",
                    "webpack-stream": "^7.0.0",
                    "yargs": "^17.7.2"
                },
                "optionalDependencies": {
                    "chai": "^4.3.7",
                    "chai-spies": "^1.0.0",
                    "ignore-styles": "^5.0.1",
                    "javascript-obfuscator": "^4.0.2",
                    "jsdoc": "^4.0.2",
                    "jsdom": "^22.1.0",
                    "jsdom-global": "^3.0.2",
                    "minami": "^1.2.3",
                    "mocha": "^10.2.0",
                    "pump": "^3.0.0",
                    "request": "^2.88.2",
                    "taffydb": "^2.7.3",
                    "webpack-cli": "^5.1.4",
                    "webpack-obfuscator": "^3.5.1"
                },
                "license": "ISC",
                "private": true,
                "repository": {
                    "type": "git",
                    "url": ""
                },
                "scripts": {
                    "prebuild": "node ./gulp/tools/run-task.js prebuild",
                    "build": "node ./gulp/tools/run-task.js",
                    "clean": "node ./gulp/tools/run-task.js clean",
                    "deploy": "node ./gulp/tools/run-task.js deploy",
                    "docs": "node ./gulp/tools/run-task.js docs",
                    "lint": "node ./gulp/tools/run-task.js lint",
                    "test": "node ./gulp/tools/run-task.js test",
                    "upload": "node ./gulp/tools/run-task.js upload",
                    "watch": "node ./gulp/tools/run-task.js watch"
                }
            });
        });
    });
    it("yo @dizmo/dizmo --git", () => {
        return helpers.run(generator).withOptions({
            "author": "Dizmo Developer",
            "bundle-id": "com.dizmo.my_dizmo",
            "email": "developer@dizmo.com",
            "git": true
        }).then(() => {
            assert.file([
                "my-dizmo.git/.gitignore"
            ]);
            assert.noFile([
                "my-dizmo.git/.npmignore"
            ]);
        });
    });
});
