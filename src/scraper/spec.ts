import { JSDOM } from 'jsdom';
import * as chai from 'chai';
import 'mocha';

import * as scraper from './index';

const assert = chai.assert;


describe('Scraper', () => {
    describe('collectSAPDSessionState', () => {
        describe('expected input fields are present', () => {
            const { document } = (new JSDOM(`<!DOCTYPE html>
                <input id='__VIEWSTATE' value='foo'></input>
                <input id='__VIEWSTATEGENERATOR' value='bar'></input>
                <input id='__EVENTVALIDATION' value='baz'></input>`
            )).window;
            const state = scraper.collectSAPDSessionState(document);
            it('returns an object', () => {
                assert.isObject(state);
            });
            it('the object has the three required state properties and no other ones', () => {
                assert.property(state, '__VIEWSTATE');
                assert.property(state, '__VIEWSTATEGENERATOR');
                assert.property(state, '__EVENTVALIDATION');
                assert.lengthOf(Object.keys(state), 3);
            });
            it('each property value is a string', () => {
                for (const prop in state) {
                    assert.isString(state[prop]);
                }
            });
        });
        describe('expected input fields are not present', () => {
            const { document } = (new JSDOM(`<!DOCTYPE html>
                <input id='__VIEWSTATE' value='foo'></input>
                <input id='__VIEWSTATEGENERATOR' value='bar'></input>`
            )).window;
            it('throws an error', () => {
                let err;

                try {
                    const state = scraper.collectSAPDSessionState(document);
                } catch (e) {
                    err = e;
                }

                assert.typeOf(err, 'Error');
            });
        });
    });
});