import { PostRequest } from './index';
import * as chai from 'chai';
import * as nock from 'nock';
import 'mocha';
const assert = chai.assert;


describe('PostRequest', () => {
	describe('methods', () => {
		describe('post', () => {
			before(() => {
				const fakeServer = nock('https://foobar.com')
					.post('/')
					.reply(200, 'foobar');
			});
			after(() => {
				nock.cleanAll();
			});
			it('should succesfully post', async function () {
				const dummyParams = {
					method: 'POST',
					uri: 'https://foobar.com'
				};

				const post = new PostRequest(dummyParams);

				const response = await post.post();
				console.log(response);

				assert.isString(response);
			});
		});
	});
});


