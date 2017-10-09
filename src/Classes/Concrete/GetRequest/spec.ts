import { GetRequest } from './index';
import * as chai from 'chai';
import * as nock from 'nock';
import * as path from 'path';
import 'mocha';
const assert = chai.assert;

describe('GetRequest', () => {
	describe('Methods', () => {
		before(() => {
			const fakeServer = nock('https://example.com')
				.get('/')
				.replyWithFile(200, path.join(__dirname, '/../../../../src/Classes/Concrete/GetRequest/example.html'));
		})
		after(() => {
			nock.cleanAll();
		})
		describe('get', () => {
			it('should return a Document', async function () {
				this.timeout(5000);

				const request = new GetRequest();

				const document = await request.get('https://example.com');

				assert.typeOf(document, 'Document');
			});
		});

		describe('getCookieJar', () => {
			it('should return an object', () => {
				const request = new GetRequest();

				assert.isObject(request.getCookieJar());
			});
		});
	});
});