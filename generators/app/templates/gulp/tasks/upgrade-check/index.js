const cli = require('../../tools/cli.js');
const ansi_colors = require('ansi-colors');
const fancy_log = require('fancy-log');
const fs = require('fs').promises;
const gulp = require('gulp');
const path = require('path');

const npm_outdated = (...args) => cli.run('npm', 'outdated', ...args)({
    stdio: 'pipe', shell: true
});
const get_epoch = async (key) => {
    const name = path.join(__dirname, 'epoch.json');
    try {
        const text = await fs.readFile(name);
        return JSON.parse(text)[key];
    } catch (ex) {
        if (ex && ex.code !== 'ENOENT') {
            console.error(ex);
        }
    }
};
const set_epoch = async (key, value) => {
    const name = path.join(__dirname, 'epoch.json');
    const json = {};
    try {
        const text = await fs.readFile(name);
        for (const [k, v] of JSON.parse(text)) {
            json[k] = v;
        }
    } catch (ex) {
        if (ex && ex.code !== 'ENOENT') {
            console.error(ex);
        }
    }
    try {
        const text = JSON.stringify({
            ...json, [key]: value
        });
        await fs.writeFile(name, text);
    } catch (ex) {
        if (ex && ex.code !== 'ENOENT') {
            console.error(ex);
        }
    }
};
const if_check = (key, delta = 86400000) => async (now) => {
    const upgrade_check = process.env['DZM_UPGRADE_CHECK'];
    if (typeof upgrade_check === 'string') try {
        return JSON.parse(upgrade_check || '0');
    } catch (ex) {
        console.error(ex);
    }
    const epoch = parseInt(await get_epoch(key)) || 0;
    if (now - epoch > delta) try {
        await set_epoch(key, now);
    } finally {
        return true;
    }
    return false;
};
const check = async (flag) => {
    if (flag) try {
        return JSON.parse(await npm_outdated(
            'yo', '<%= generator_name.split(":")[0] %>', '-g', '--json'
        ));
    } catch (ex) {
        console.error(ex);
    }
    return null;
};
const print = (json, text = 'Generator Upgrade Available', box = {
    width: 57, padding: (offset) => (box.width - text.length) / 2 + (
        offset ? (box.width - text.length) % 2 : 0
    )
}) => {
    if (typeof json !== 'object' || json === null || !json.length) {
        return;
    }
    fancy_log(`┌${'─'.repeat(box.width)}┐`);
    fancy_log(`│${' '.repeat(box.padding(0)) + ansi_colors.yellow.bold(text) + ' '.repeat(box.padding(1))}│`);
    fancy_log(`└${'─'.repeat(box.width)}┘`);
    for (const [key, item] of Object.entries(json).reverse()) {
        fancy_log(`> ${key} @${item.current}, but latest @${item.latest}; run:`);
        fancy_log(ansi_colors.yellow.bold(`npm upgrade -g ${key}`));
    }
    fancy_log(`> Then to upgrade project run:`);
    fancy_log(ansi_colors.yellow.bold(
        `yo <%= generator_namespace.split(":")[0] %> --upgrade --skip-install`
    ));
    fancy_log(`> For further information see:`);
    fancy_log(ansi_colors.white.bold(
        `https://www.npmjs.com/package/@dizmo/generator-dizmo#upgrading-the-build-system`
    ));
};
gulp.task('upgrade-check', () =>
    if_check('@dizmo/generator-dizmo')(Date.now()).then(check).then(print)
);
