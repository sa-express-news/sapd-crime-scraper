import * as rp from 'request-promise-native';
import { JSDOM } from 'jsdom';

import { GetDocumentResponse, PostFormParams } from '../Interfaces';
import { CookieJar } from 'request';

export const getDocument = async (url: string, jar?: CookieJar): Promise<GetDocumentResponse> => {
    const cookieJar: CookieJar = !jar ? rp.jar() : jar;
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