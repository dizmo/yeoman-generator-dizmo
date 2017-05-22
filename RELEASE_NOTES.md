# RELEASE NOTES

## v7.y.z

### MAJOR CHANGES

* Integration of ES6 via [Babel] to support latest JavaScript standard:

    Browsers and the libraries, which the former are built upon (like Webkit), usually lag behind the latest standard, and hence fail to provide up-to-date language support. The [Babel] *transpiler* however, can take a script written in a modern standard and translate it into backwards compatible JavaScript.

* Upgrade support via `yo dizmo --upgrade` to enable seamless developer experience:

    Thanks to [Yeoman]'s built in conflict resolution mechanism, it was already possible to upgrade an older project by running `yo dizmo` within the corresponding folder.

    However, the conflict resolution was requiring to sign-off each change by the developer. While this was not an issue for experience developers, it was difficult for novice ones to decide which parts of a project to override and which parts to keep. This decision process has now been automated, by using heuristics, where any change w.r.t. to the [Gulp] build system is applied automatically and no change is performed on the non-build system related parts. 

### NOTABLE CHANGES

* Integration of the [pump] library for improved error reporting:

    The [Gulp] build system lacks proper support to identify and report the source of a particular error. However by integrating [pump] this issue has been easily remedied.

* Don't show the output of `npm install`, and instead display a CLI based spinner:

    This ensure a nice developer experience while building a dizmo with `npm run make`. However, in case something goes wrong while fetching the dependencies, `npm install` can still be run and the corresponding output will be shown.

## v6.y.z

### MAJOR CHANGES

* Enable dizmo to be uploaded to the dizmoStore by running `npm run upload`:
 
    Upon uploading a dizmo to the store, the developer is required to provide the correct store host and login credentials (user name and password).

* Publish a dizmo upon an upload:

    So far it was only possible to upload a dizmo to dizmoStore. Now upon a successful upload (with `npm run upload`) it is automatically published, but which can be suppressed by providing `--no-publish` flag.

### NOTABLE CHANGES

* Allow `npm run upload` to be configured via (i) CLI options, (ii) environment variable and (iii-a) `package.json` or (iii-b) `.generator-dizmo/config.json`. 

* Don't require `npm install` to be run:

    Before running scripts like `npm run make` it was mandatory to install the dependencies by explicitly installing them. This requirement has now been dropped, since the scripts check beforehand if the dependency folder `node_modules` exist and otherwise install the dependencies correspondingly.

## v5.y.z

### MAJOR CHANGES

* Minification with obfuscation support:

    Upon major request JavaScript obfuscation has been integrated. When the dizmo is built with minification on, then by default the script code is also obfuscated (which can be suppressed by providing a `--no-obfuscate` flag).

* Renamed `npm run install` to `npm run deploy`:

    It was for many (novice) developers confusing to distinguish `npm install` from `npm run install`. Hence the latter has been renamed to `npm run deploy`.

### NOTABLE CHANGES

* CLI options upon building a dizmo to (i) minify and (ii) lint a dizmo build, overriding any configuration via `package.json` or via environment variables.

## v4.y.z

### MAJOR CHANGES

* Semi-automatic skeleton upgrade:

    [Yeoman] has a built in conflict resolution mechanism which enabled a generator to be run over an existing project. Any conflict needs then to be manually signed-off by the developer.

    This mechanism was only working, when the `yo dizmo` command was invoked from *outside* a project. Now, it's possible to upgrade by executing it from *within* the project, where any configuration in `package.json` will automatically be considered.

* Merged the extended skeleton into the base one:

    It was for many (novice) developers confusing to start working with the extended skeleton (supporting SCSS et. al.) after having worked with the base one.

### NOTABLE CHANGES

* Fixed drag-and-drop message upon installing (i.e. deploying) a dizmo to the folder of installed dizmos.

* Fixed watcher such that they can be invoked on `Windows` systems as well.

## v3.y.z

### MAJOR CHANGES

* Branding of `generator-dizmo` as *dizmoGen*:

    The [Yeoman] toolkit requires to project's name to start with `generator`. Otherwise the generator is not index on their website: Hence the name was kept as is, but the README.md document has been updated correspondingly to reflect the *dizmoGen* branding.

### NOTABLE CHANGES

* Check for `.info.plist`:

    Some developers where manually copying all visible files from one project to another one, forgetting the invisible ones. Hence, now at least for `.info.plist` a corresponding check upon building a dizmo is performed. 

## v2.y.z

### MAJOR CHANGES

* Dependency management thanks to [Browserify]:

    It's possible now to `require('..')` an external NPM module or a project specific JavaScript file.

* Watcher support:

    Introduced the possibility to watch the file system to source code changes, and automatically re-build a dizmo. Since the re-build is *incremental* - even when requiring relatively large libraries in a project - it's fast!

* Sub-generator for [TypeScript], which is a super-set of JavaScript with integrated (optional) static typing support.

* Internationalization support using the [i18next] framework, where translation look-ups can be found under the `assets/` folder.

### NOTABLE CHANGES

* Linting support for *TypeScript* and *CoffeeScript* sug-generators.

* SASS with minification support for the [CoffeeScript] sub-generator.

* Introduced a README.md:

    Extensively documented the feature set of generator.

## v1.y.z

### MAJOR CHANGES

* Initial generator based on [Yeoman].

* Support for an extended sub-generator with support for [SASS], [ESLint], and minification via [UglifyJS].

* Sub-generator for [CoffeeScript], which is a alternative to JavaScript transpiling down to it.

* Introduced support for GIT by initializing a new project as a repository (with the `--git` flag).

### NOTABLE CHANGES

* Support for linting via a `.eslintrc.json` configuration for the [ESlint] linting utility for JavaScript.

* Enabled hierarchical configuration support for `package.json` via `.generator-dizmo/config.json`.

* Smartly remembering previously provided domain name (like e.g. `com.dizmo`) via the prompt.

* Enabled Windows compatibility by ensuring that the NPM script are run in with a proper `node` invocation.

* Increased NPM's built in caching to a week, to ensure fast(er) initial fetching of dependencies.

[pump]: http://www.npmjs.com/package/pump
[Babel]: http://babeljs.io
[Gulp]: http://gulpjs.com/
[Yeoman]: http://yeoman.io/
[Browserify]: http://browserify.org/
[TypeScript]: http://www.typescriptlang.org/
[CoffeeScript]: http://coffeescript.org/
[ESLint]: http://eslint.org/
[SASS]: http://sass-lang.com/
[UglifyJS]: http://github.com/mishoo/UglifyJS