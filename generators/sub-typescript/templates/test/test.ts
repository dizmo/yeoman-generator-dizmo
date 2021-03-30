import { Global } from '@dizmo/dizmo.js';
declare const global: Global;

import { dizmo } from '@dizmo/dizmo.js';
import { bundle } from '@dizmo/dizmo.js';
import { viewer } from '@dizmo/dizmo.js';

import spies from 'chai-spies';
import chai from 'chai';
chai.use(spies);

before(() => {
    global.i18n = chai.spy();
    global.index = require('../source/index');
});
describe('<%= dizmoName %>', () => {
    it('should expect dizmo to exists', () => {
        chai.expect(dizmo).to.exist;
    });
    it('should expect bundle to exists', () => {
        chai.expect(bundle).to.exist;
    });
    it('should expect viewer to exists', () => {
        chai.expect(viewer).to.exist;
    });
});
describe('<%= dizmoName %>', () => {
    it('should expect global.showBack to be a function', () => {
        chai.expect(global.showBack).to.be.a('function');
    });
    it('should expect global.showFront to be a function', () => {
        chai.expect(global.showFront).to.be.a('function');
    });
});
describe('<%= dizmoName %>', () => {
    it('should expect global.i18n to be a function', () => {
        chai.expect(global.i18n).to.be.a('function');
    });
    it('should expect global.i18n to have been called with onI18n', () => {
        chai.expect(global.i18n).to.have.been.called.with(global.index.onI18n);
    });
});
describe('<%= dizmoName %>', () => {
    before(() => {
        chai.spy.on(dizmo, 'subscribeToAttribute'/*, () => 'UUID'*/);
        const done = document.createElement('button') as HTMLElement;
        done.setAttribute('id', 'done'); document.body.append(done);
        document.dispatchEvent(new Event('dizmoready'));
    });
    it('should expect dizmo.subscribeToAttribute to have been called', () => {
        chai.expect(dizmo.subscribeToAttribute).to.have.been.called();
    });
    it('should expect done.onclick handler to be a function', () => {
        const done = document.getElementById('done') as HTMLElement;
        chai.expect(done.onclick).to.be.a('function');
    });
});
