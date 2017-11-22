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

export interface Call {
    incidentNumber: string;
    category: string;
    problemType: string;
    responseDate: Date;
    address: string;
    hoa: string;
    schoolDistrict: string;
    councilDistrict: number;
    zipcode: number;
}

export interface SAPDFormParams {
    ToolkitScriptManager1_HiddenField: string;
    __EVENTTARGET: string;
    __EVENTARGUMENT: string;
    __LASTFOCUS: string;
    __VIEWSTATE: string;
    __VIEWSTATEGENERATOR: string;
    __EVENTVALIDATION: string;
    txtStart: string;
    rdbSearchRange: string;
    txtEndDate: string;
    txtZipcode: string;
    ddlCategory: string;
    ddlCouncilDistrict: string;
    ddlSchoolDistrict: string;
    cbxHOA$cbxHOA_TextBox: string;
    cbxHOA$cbxHOA_HiddenField: string;
    btnSearch: string;
}

export interface VariableSAPDFormParams {
    txtStart: string;
    txtEndDate: string;
    ddlCouncilDistrict: string;
}