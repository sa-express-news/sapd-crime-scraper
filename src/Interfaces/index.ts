import { CookieJar } from "request";

export interface GetDocumentResponse {
    document: Document;
    cookieJar: CookieJar
}

export interface PostFormParams {
    method: 'POST';
    uri: string;
    form: object;
    jar?: CookieJar;
    headers?: object;
}

export interface SAPDSessionState {
    __VIEWSTATE: string;
    __VIEWSTATEGENERATOR: string;
    __EVENTVALIDATION: string;
}