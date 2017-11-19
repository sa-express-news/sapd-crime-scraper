import { JSDOM } from 'jsdom';
import * as chai from 'chai';
import 'mocha';

import * as scraper from './index';
import resultsPageHTMLString from './resultsPageHTMLString';

import { Call } from '../Interfaces';

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
    describe('scrapeCallsFromPage', () => {
        describe('page contains a table of calls', () => {
            const { document } = (new JSDOM(resultsPageHTMLString)).window;

            const calls = scraper.scrapeCallsFromPage(document);
            it('returns an array', () => {
                assert.isArray(calls);
            });
            it('each item in the array is a call', () => {

            })
        });
    });
    describe('isCall', () => {
        it('returns true if the object passed is a valid Call', () => {
            const call: Call = {
                incidentNumber: 'foo',
                category: 'bar',
                problemType: 'baz',
                responseDate: new Date(),
                address: 'i',
                hoa: 'am',
                schoolDistrict: 'listening',
                councilDistrict: 500,
                zipcode: 1
            };

            assert.isTrue(scraper.isCall(call));
        });
        it('returns false if any of the required Call properties are missing', () => {
            const call = {
                incidentNumber: 'foo',
                category: 'bar',
                problemType: 'baz',
                address: 'i',
                hoa: 'am',
                schoolDistrict: 'listening',
                councilDistrict: 500,
                zipcode: 1
            };

            assert.isFalse(scraper.isCall(call));

        });
        it('returns false if any of the required Call properties are the wrong type', () => {
            const call = {
                incidentNumber: 'foo',
                category: 'bar',
                problemType: 'baz',
                responseDate: { foo: 'bar' },
                address: 'i',
                hoa: 'am',
                schoolDistrict: 'listening',
                councilDistrict: 500,
                zipcode: 1
            };

            assert.isFalse(scraper.isCall(call));
        });
    });
});