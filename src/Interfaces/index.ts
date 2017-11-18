import { CookieJar } from "request";

export interface GetDocumentResponse {
    document: Document;
    cookieJar: CookieJar
}