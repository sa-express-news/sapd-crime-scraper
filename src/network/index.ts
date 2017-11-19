import * as rp from 'request-promise-native';
import { JSDOM } from 'jsdom';

import { GetDocumentResponse, PostFormParams } from '../Interfaces/';

export const getDocument = async (url: string): Promise<GetDocumentResponse> => {
    const cookieJar = rp.jar();
    try {
        const html = await rp({ uri: url, jar: cookieJar });
        const page: Document = new JSDOM(html).window.document;

        return {
            document: page,
            cookieJar: cookieJar
        };
    } catch (e) {
        throw new Error(e);
    }

}

export const postForm = async (params: PostFormParams): Promise<any> => {
    try {
        const postResponse = await rp(params);
        return postResponse;
    } catch (e) {
        throw new Error(e);
    }
}