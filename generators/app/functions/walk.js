module.exports = async function walk(
    base, callback, options = {
        include: /\.js$/,
        exclude: undefined
    }
) {
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
