import { GetRequest } from './index';
import * as chai from 'chai';
import 'mocha';
const assert = chai.assert;

describe('GetRequest', ()=>{
	describe('Methods', ()=>{
		describe('get', ()=>{
			it('should return a Document', async ()=>{
				const request = new GetRequest();

				const document = await request.get('https://example.com');

				assert.typeOf(document, 'Document');
			});
		});

		describe('getCookieJar', ()=>{
			it('should return an object', ()=>{
				const request = new GetRequest();

				assert.isObject(request.getCookieJar());
			});
		});
	});
});