import * as chai from 'chai';
import * as nock from 'nock';
import * as path from 'path';
import 'mocha';
const assert = chai.assert;

import * as net from './index';

describe('Network', () => {
    describe('getDocument', () => {
        const endpoint = 'https://example.com'
        before(() => {
            const fakeServer = nock(endpoint)
                .get('/')
                .replyWithFile(200, path.join(__dirname, '/../../src/network/example.html'));
        })
        after(() => {
            nock.cleanAll();
        })
        it('throws an error if the request does not properly execute', async () => {

            let err;

            try {
                const result = await net.getDocument('http://httpstat.us/500');
            } catch (e) {
                err = e;
            }

            assert.typeOf(err, 'Error');
        });
        describe('successful response', async () => {
            const response = await net.getDocument(endpoint);

            const { document, cookieJar } = response;
            it('returns an object', () => {
                assert.isObject(response);
            });
            it('the object has a document property, which is a Document', () => {
                assert.typeOf(document, 'Document');
            });
            it('the object has a cookieJar property, which is a request CookieJar', () => {
                assert.isObject(cookieJar);
                const { setCookie, getCookieString, getCookies } = cookieJar;
                assert.isFunction(setCookie);
                assert.isFunction(getCookieString);
                assert.isFunction(getCookies);
            });
        });
    });
});