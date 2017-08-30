import { PostRequest } from './index';
import * as chai from 'chai';
import 'mocha';
const assert = chai.assert;

if(process.env.NETWORK_TEST === 'true'){
	describe('PostRequest', ()=>{
		describe('methods', ()=>{
			describe('post', ()=>{
				it('should succesfully post', async function(){
					this.timeout(10000);
					const dummyParams = {
						method: 'POST',
						uri: 'https://httpbin.org/post'
					};

					const post = new PostRequest(dummyParams);

					const response = await post.post();

					assert.isString(response);
				});
			});
		});
	});	
}

