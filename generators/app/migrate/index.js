const { matchRecursive: xmatch } = require('xregexp');
const walk = require('../functions/walk');
const chalk = require('chalk');
const fs = require('fs');

const rx = (method, flags = 'g') => {
    return new RegExp(`(dizmo|bundle|viewer)\.${method}`, flags);
};
const rx_public = (method, flags = 'g') => {
    return new RegExp(`(dizmo|bundle|viewer)\.publicStorage\.${method}`, flags);
};
const rx_private = (method, flags = 'g') => {
    return new RegExp(`(dizmo|bundle|viewer)\.privateStorage\.${method}`, flags);
};
async function unsubscriptions(base, options) {
    await walk(base, (filepath) => {
        const script = fs.readFileSync(filepath, 'utf8')
            .replace(rx('unsubscribeRemoteHost'), '$1.unsubscribe')
            .replace(rx('unsubscribeParentChange'), '$1.unsubscribe')
            .replace(rx('unsubscribeChildren'), '$1.unsubscribe')
            .replace(rx('unsubscribeDizmoChanged'), '$1.unsubscribe')
            .replace(rx('unsubscribeBundleChanged'), '$1.unsubscribe');
        fs.writeFileSync(filepath, script);
    }, options);
}
async function attributes(base, options) {
    await walk(base, (filepath) => {
        const script = fs.readFileSync(filepath, 'utf8')
            .replace(rx('getAttribute'), '$1.getAttribute')
            .replace(rx('setAttribute'), '$1.setAttribute')
            .replace(rx('deleteAttribute'), '$1.deleteAttribute')
            .replace(rx('subscribeToAttribute'), '$1.onAttribute')
            .replace(rx('subscribeToAttributeConditional'), '$1.onAttributeIf')
            .replace(rx('unsubscribeAttribute'), '$1.unsubscribe')
            .replace(rx('beginAttributeUpdate'), '$1.beginAttributeUpdate')
            .replace(rx('endAttributeUpdate'), '$1.endAttributeUpdate')
            .replace(rx('cacheAttribute'), '$1.cacheAttribute')
            .replace(rx('uncacheAttribute'), '$1.uncacheAttribute');
        fs.writeFileSync(filepath, script);
    }, options);
}
async function private_properties(base, options) {
    await walk(base, (filepath) => {
        const script = fs.readFileSync(filepath, 'utf8')
            .replace(rx_private('getProperty'), '$1.getProperty')
            .replace(rx_private('setProperty'), '$1.setProperty')
            .replace(rx_private('deleteProperty'), '$1.deleteProperty')
            .replace(rx_private('subscribeToProperty'), '$1.onProperty')
            .replace(rx_private('unsubscribeProperty'), '$1.unsubscribe')
            .replace(rx_private('beginPropertyUpdate'), '$1.beginPropertyUpdate')
            .replace(rx_private('endPropertyUpdate'), '$1.endPropertyUpdate')
            .replace(rx_private('cacheProperty'), '$1.cacheProperty')
            .replace(rx_private('uncacheProperty'), '$1.uncacheProperty');
        fs.writeFileSync(filepath, script);
    }, options);
}
async function public_properties(base, options) {
    await walk(base, (filepath) => {
        const replace = (script, method, new_method) => {
            let m, re = rx_public(method);
            while (
                (m = re.exec(script)) !== null
            ) {
                const at = m.index + m[0].length;
                try {
                    const xm = xmatch(script.slice(at), '\\(', '\\)', '', {
                        valueNames: ['between', 'left', 'match', 'right']
                    });
                    if (xm && xm.length) {
                        const [l, m, r] = xm;
                        if (l && l.name === 'left' &&
                            m && m.name === 'match' &&
                            r && r.name === 'right'
                        ) {
                            script = script.slice(0, at)
                                + l.value // opening parenthesis
                                + m.value // list of parameter(s)
                                + ', { public: true }' // public
                                + r.value // closing parenthesis
                                + script.slice(at + r.end);
                            script = script
                                .replace(rx_public(method, ''), new_method);
                        }
                    }
                } catch (ex) {
                    console.log(`${
                        chalk.yellow.bold('[WARN]')
                    } failed rewriting ${
                        chalk.white.bold(m[0])
                    } as ${
                        chalk.white.bold(m[0].replace(rx_public(method, ''), new_method))
                    }; rewrite manually plus add the missing ${
                        chalk.white.bold('{ public: true }')
                    } flag -- see: ${
                        filepath + ':' + at
                    }`);
                    script = script.replace(
                        rx_public(method, ''), `$1.publicStorage.${method.toUpperCase()}`
                    );
                }
            }
            return script.replace(
                rx_public(method.toUpperCase()), `$1.publicStorage.${method}`
            );
        };
        let script = fs.readFileSync(filepath, 'utf8');
        script = replace(script, 'getProperty', '$1.getProperty');
        script = replace(script, 'setProperty', '$1.setProperty');
        script = replace(script, 'deleteProperty', '$1.deleteProperty');
        script = replace(script, 'subscribeToProperty', '$1.onProperty');
        script = replace(script, 'unsubscribeProperty', '$1.unsubscribe');
        script = replace(script, 'beginPropertyUpdate', '$1.beginPropertyUpdate');
        script = replace(script, 'endPropertyUpdate', '$1.endPropertyUpdate');
        script = replace(script, 'cacheProperty', '$1.cacheProperty');
        script = replace(script, 'uncacheProperty', '$1.uncacheProperty');
        fs.writeFileSync(filepath, script);
    }, options);
}
/**
 * @param {string} base
 * @param {include?: RegExp, exclude?: RegExp} options
 */
module.exports = async function (
    base, options
) {
    await unsubscriptions(base, options);
    await attributes(base, options);
    await private_properties(base, options);
    await public_properties(base, options);
};
