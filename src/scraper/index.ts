import { SAPDFormParamConstants, SAPDFormPOSTHeaders } from '../constants';
import { getDocument, postForm } from '../network';

import { IDatabase } from 'pg-promise';
import { callColSet } from '../database/columnSets';
import { upsertReplaceQuery } from '../database';
import { getAllDatesBetweenInclusive } from '../util';
import { SAPDSessionState, Call, VariableSAPDFormParams, SAPDFormParams, PostFormParams } from '../Interfaces';

export const collectSAPDSessionState = (page: Document): SAPDSessionState => {
    const viewStateInput = <HTMLInputElement>page.getElementById('__VIEWSTATE');
    const viewState: string = viewStateInput.value;

    const viewStateGeneratorInput = <HTMLInputElement>page.getElementById('__VIEWSTATEGENERATOR');
    const viewStateGenerator: string = viewStateGeneratorInput.value;

    const eventValidationInput = <HTMLInputElement>page.getElementById('__EVENTVALIDATION');
    const eventValidation: string = eventValidationInput.value;

    if (!viewState || !viewStateGenerator || !eventValidation) {
        throw new Error('Required state input fields are not present in document');
    }

    return {
        __VIEWSTATE: viewState,
        __VIEWSTATEGENERATOR: viewStateGenerator,
        __EVENTVALIDATION: eventValidation
    };
}

export const scrapeCallsFromPage = (page: Document): Call[] => {
    const table = page.getElementById('gvCFS');
    const rows = Array.from(table.getElementsByTagName('tr'));

    if (!table || !rows) {
        throw new Error('Page does not contain expected call table');
    }
    //We splice the first element because it's just the column headers
    rows.splice(0, 1);

    const rawCalls: Call[] = rows.map((tr: HTMLTableRowElement) => {
        const tableData: string[] = Array.from(tr.getElementsByTagName('td')).map(td => { return td.textContent });

        const call: Call = {
            incidentnumber: tableData[0],
            category: tableData[1],
            problemtype: tableData[2],
            responsedate: new Date(tableData[3]),
            address: tableData[4],
            hoa: tableData[5],
            schooldistrict: tableData[6],
            councildistrict: tableData[7].trim() !== '' ? parseInt(tableData[7]) : 99,
            zipcode: tableData[8].trim() !== '' ? parseInt(tableData[8]) : 0
        };

        return call;
    });

    const calls = rawCalls.filter(isCall);

    return calls;
}

export const runScrapeJob = async (date: Date, councilDistrict: number): Promise<Call[]> => {
    if (date < new Date('01/01/2011')) {
        throw new Error('Cannot scrape dates before Jan. 1, 2011');
    }

    const dateString = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    // Generate the parameters for the SAPD form that are unique to this request

    const variableParams: VariableSAPDFormParams = {
        txtStart: dateString,
        txtEndDate: dateString,
        ddlCouncilDistrict: councilDistrict.toString()
    };

    try {
        // Fetch the SAPD web form, taking the page and the cookies it sends
        const { document: searchPage, cookieJar } = await getDocument('https://webapp3.sanantonio.gov/policecalls/Reports.aspx');

        // Get the current session state from the web page
        const sessionState = collectSAPDSessionState(searchPage);

        // Bundle the variable params, session state and param constants together into an object we'll pass to the web app form
        const formParams = Object.assign({}, SAPDFormParamConstants, variableParams, sessionState);

        const postParams: PostFormParams = {
            method: 'POST',
            uri: 'https://webapp3.sanantonio.gov/policecalls/Reports.aspx',
            form: formParams,
            jar: cookieJar,
            headers: SAPDFormPOSTHeaders,
            followAllRedirects: true
        };

        // Post to the form
        await postForm(postParams);

        // Get the results page, which should now contain the requested calls

        const resultsPageResponse = await getDocument('https://webapp3.sanantonio.gov/policecalls/Results.aspx', cookieJar);

        const { document: resultsPage } = resultsPageResponse;

        return scrapeCallsFromPage(resultsPage);

    } catch (e) {
        throw new Error(e);
    }
}

export const runScrapeQueue = async (startDate: Date, endDate: Date, councilDistricts: number[], db: IDatabase<any>): Promise<void> => {
    const earlyThresholdDate = new Date('01/01/2011');
    if (startDate < earlyThresholdDate || endDate < earlyThresholdDate) {
        throw new Error('Cannot scrape dates before Jan. 1, 2011');
    }

    if (councilDistricts.length === 0) {
        throw new Error('You must pass an array of at least one council district (0-10, 0 being outside any district)');
    }

    // Generate an array of every date between the start and end date

    const targetDates = getAllDatesBetweenInclusive(startDate, endDate);

    // If there is more than one date in this array, we need to remove the last date (the end date).
    // That's because for whatever reason, if you ask the SAPD form for a day's worth of data,
    // it will give you that day and the next day.
    // On a single-date scrape, there's not much we can do - just prune the data after you get it.
    // On multi-day scrapes, removing the last day will give us the range of data we actually asked for.
    // If anyone can figure out a way to ping the form and fix this problem, PRs are welcome.

    if (targetDates.length > 1) {
        targetDates.pop();
    }

    try {

        // For each date:

        for (let date of targetDates) {
            for (let district of councilDistricts) {
                // Get every call for the given date and district

                const calls = await runScrapeJob(date, district);

                // Generate an upsert query using all the calls

                const upsertQuery = upsertReplaceQuery(calls, callColSet, 'incidentNumber');

                // Run the query

                await db.query(upsertQuery);
            }
        }
    } catch (e) {
        throw new Error(`Scrape failed: ${e}`);
    }
}

export const isCall = (object: object): boolean => {
    const { incidentnumber, category, problemtype, responsedate, address, hoa, schooldistrict, councildistrict, zipcode } = <Call>object;

    if (typeof incidentnumber !== 'string') return false;
    if (typeof category !== 'string') return false;
    if (typeof problemtype !== 'string') return false;
    if (Object.prototype.toString.call(responsedate) !== "[object Date]") return false;
    if (typeof address !== 'string') return false;
    if (typeof hoa !== 'string') return false;
    if (typeof schooldistrict !== 'string') return false;
    if (isNaN(councildistrict)) return false;
    if (isNaN(zipcode)) return false;

    return true;
}