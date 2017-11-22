import * as chai from 'chai';
import * as nock from 'nock';
import * as path from 'path';
import * as rp from 'request-promise-native';
import { cookie } from 'request';
import 'mocha';
const assert = chai.assert;

import * as net from './index';

import { PostFormParams } from '../Interfaces';

describe('Network', () => {
    const endpoint = 'https://example.com';
    const badEndpoint = 'https://500error.com';
    before(() => {
        const badGetServer = nock(badEndpoint)
            .persist()
            .get('/')
            .reply(500);

        const badPostServer = nock(badEndpoint)
            .persist()
            .post('/')
            .reply(500);
    });
    after(() => {
        nock.cleanAll();
    })

    describe('getDocument', () => {
        before(() => {
            const fakeServer = nock(endpoint)
                .persist()
                .get('/')
                .replyWithFile(200, path.join(__dirname, '/../../src/network/example.html'));
        });
        describe('unsuccessful request', () => {
            it('throws an error if the request does not properly execute', async () => {

                let err;

                try {
                    const result = await net.getDocument(badEndpoint);
                } catch (e) {
                    err = e;
                }

                assert.typeOf(err, 'Error');
            });
        });
        describe('successful request', async () => {
            let response, document, cookieJar;

            before(async () => {
                response = await net.getDocument(endpoint);
                document = response.document;
                cookieJar = response.cookieJar;
            });
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
            it('if passed a cookieJar, it returns the same one after a request', async () => {
                const cookieJar = rp.jar();
                const theCookie = cookie('foo=bar');
                cookieJar.setCookie(theCookie, 'http://foobar.com');

                const response = await net.getDocument(endpoint, cookieJar);
                const responseJar = response.cookieJar;

                assert.strictEqual('foo=bar', responseJar.getCookieString('http://foobar.com'))
            });
        });
    });
    describe('postForm', () => {
        before(() => {
            const fakeServer = nock(endpoint)
                .persist()
                .post('/', {
                    username: 'kia',
                    password: 'alvvays'
                })
                .reply(200, 'foobar');
        });
        describe('unsuccessful request', () => {
            it('throws an error if the request does not properly execute', async () => {

                let err;

                const params: PostFormParams = {
                    method: 'POST',
                    uri: badEndpoint,
                    form: {
                        username: 'kia'
                    }
                };

                try {
                    const result = await net.postForm(params);
                } catch (e) {
                    err = e;
                }

                assert.typeOf(err, 'Error');
            });
        });
        describe('successful request', () => {
            it('returns whatever the server should return', async () => {
                const params: PostFormParams = {
                    method: 'POST',
                    uri: endpoint,
                    form: {
                        username: 'kia',
                        password: 'alvvays'
                    }
                };

                const response = await net.postForm(params);
                assert.isString(response);
                assert.strictEqual(response, 'foobar');
            });
        });
    });
});