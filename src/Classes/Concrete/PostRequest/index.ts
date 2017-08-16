import { PostRequestParams } from '../../../Interfaces/PostRequestParams';
import * as rp from 'request-promise-native';
import { JSDOM } from 'jsdom';

export class PostRequest{
	params: PostRequestParams;
	response: any;

	constructor(params: PostRequestParams){
		this.params = params;
	}

	public async post(): Promise<any>{
		try{
			const p = await rp(this.params);
			this.response = p;

			return p;

		}catch(e){
			return e;
		}
	}
}