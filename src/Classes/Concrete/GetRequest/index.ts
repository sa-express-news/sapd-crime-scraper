import * as rp from 'request-promise-native';
import { JSDOM } from 'jsdom';

export class GetRequest{
	private page: Document;
	private cookieJar: object;

	constructor(){
		this.cookieJar = rp.jar();
	}

	public async get(url: string): Promise<Document>{
		const requestOptions = {uri: url, jar: this.cookieJar};

		const html = await rp(requestOptions);

		const page = new JSDOM(html).window.document;
		this.page = page;

		return this.page;

	}

	public getCookieJar(): object{
		return this.cookieJar;
	}
}