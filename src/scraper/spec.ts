import { JSDOM } from 'jsdom';
import * as nock from 'nock';
import * as path from 'path';
import * as chai from 'chai';
import * as sinon from 'sinon';
import 'mocha';

import { db } from '../database';
import * as scraper from './index';
import * as network from '../network';
import resultsPageHTMLString from './resultsPageHTMLString';

import { Call } from '../Interfaces';

import { viewStateGenerator, eventValidation, viewState } from './sessionState';

const assert = chai.assert;


describe('Scraper', () => {
    describe('collectSAPDSessionState', () => {
        describe('expected input fields are present', () => {
            const { document } = (new JSDOM(`<!DOCTYPE html>
                <input id='__VIEWSTATE' value='foo'></input>
                <input id='__VIEWSTATEGENERATOR' value='bar'></input>
                <input id='__EVENTVALIDATION' value='baz'></input>`
            )).window;
            const state = scraper.collectSAPDSessionState(document);
            it('returns an object', () => {
                assert.isObject(state);
            });
            it('the object has the three required state properties and no other ones', () => {
                assert.property(state, '__VIEWSTATE');
                assert.property(state, '__VIEWSTATEGENERATOR');
                assert.property(state, '__EVENTVALIDATION');
                assert.lengthOf(Object.keys(state), 3);
            });
            it('each property value is a string', () => {
                for (const prop in state) {
                    assert.isString(state[prop]);
                }
            });
        });
        describe('expected input fields are not present', () => {
            const { document } = (new JSDOM(`<!DOCTYPE html>
                <input id='__VIEWSTATE' value='foo'></input>
                <input id='__VIEWSTATEGENERATOR' value='bar'></input>`
            )).window;
            it('throws an error', () => {
                let err;

                try {
                    const state = scraper.collectSAPDSessionState(document);
                } catch (e) {
                    err = e;
                }

                assert.typeOf(err, 'Error');
            });
        });
    });
    describe('scrapeCallsFromPage', () => {
        describe('page contains a table of calls', () => {
            const { document } = (new JSDOM(resultsPageHTMLString)).window;

            const calls = scraper.scrapeCallsFromPage(document);
            it('returns an array', () => {
                assert.isArray(calls);
            });
            it('each item in the array is a call', () => {
                calls.forEach(call => assert.isTrue(scraper.isCall(call)));
            });
        });
        describe('page does not contain the expected table of calls', () => {
            it('throws an error if there is no table at all', () => {
                const { document } = (new JSDOM(`<!DOCTYPE html>`)).window;
                let err;

                try {
                    const calls = scraper.scrapeCallsFromPage(document);
                } catch (e) {
                    err = e;
                }

                assert.typeOf(err, 'Error');
            });
        });
    });
    describe('runScrapeJob', () => {
        const reportsEndpoint = `https://webapp3.sanantonio.gov/`;
        const resultsEndpoint = `https://webapp3.sanantonio.gov/`;
        before(() => {
            const reportsGetServer = nock(reportsEndpoint)
                .defaultReplyHeaders({
                    'Cookie': 'ASP.NET_SessionId=3lejdamtppr0iseefz5czqy2'
                })
                .persist()
                .get('/policecalls/Reports.aspx')
                .replyWithFile(200, path.join(__dirname, '/../../src/scraper/reports.html'));

            const reportsPostServer = nock(reportsEndpoint)
                .persist()
                .post('/policecalls/Reports.aspx', {
                    ToolkitScriptManager1_HiddenField: ';;AjaxControlToolkit, Version=3.5.60623.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:834c499a-b613-438c-a778-d32ab4976134:f9cec9bc:de1feab2:f2c8e708:720a52bf:589eaa30:698129cf:d9d4bb33:fcf0e993:fb9b4c57:ccb96cf9',
                    __EVENTTARGET: '',
                    __EVENTARGUMENT: '',
                    __LASTFOCUS: '',
                    __VIEWSTATE: viewState,
                    __VIEWSTATEGENERATOR: viewStateGenerator,
                    __EVENTVALIDATION: eventValidation,
                    rdbSearchRange: 'day',
                    txtZipcode: '',
                    ddlCategory: 'ALL ',
                    ddlSchoolDistrict: ' ',
                    cbxHOA$cbxHOA_TextBox: '',
                    cbxHOA$cbxHOA_HiddenField: '-1',
                    btnSearch: 'View Data',
                    txtStart: '10/01/2017',
                    txtEndDate: '10/01/2017',
                    ddlCouncilDistrict: '1'
                })
                .reply(200);

            const resultsGetServer = nock(resultsEndpoint, {
                reqheaders: {
                }
            })
                .persist()
                .get('/policecalls/Results.aspx')
                .replyWithFile(200, path.join(__dirname, '/../../src/scraper/results.html'));
        });
        after(() => {
            nock.cleanAll();
        });

        it('throws an error if passed a date before 1/1/11', async () => {
            const earlyDate = new Date('12/31/2010');
            let err;

            try {
                const calls = await scraper.runScrapeJob(earlyDate, 0);
            } catch (e) {
                err = e;
            }

            assert.typeOf(err, 'Error');
        });
        describe('Successful request', () => {
            it('returns an array of Calls', async () => {
                const calls = await scraper.runScrapeJob(new Date('10/01/2017'), 1);
                assert.isArray(calls);
                calls.forEach((call) => {
                    assert.isTrue(scraper.isCall(call));
                });
            });
            it('scrapes every call the web application provides', async () => {
                const calls = await scraper.runScrapeJob(new Date('10/01/2017'), 1);
                // Running a search for district 1 on 10/01/2017 on the actual web app will give you 443 results
                assert.lengthOf(calls, 443);
            });
        });
        describe('Unsuccessful requests', () => {
            it('throws an error', async () => {
                const postFormStub = sinon.stub(network, 'postForm');
                postFormStub.throws();

                let err;

                try {
                    const calls = await scraper.runScrapeJob(new Date('10/01/2017'), 1);
                } catch (e) {
                    err = e;
                }

                postFormStub.restore();

                assert.typeOf(err, 'Error');
            });
        });
    });
    describe('runScrapeQueue', () => {
        it('throws an error if either the start or end date passed is before 1/1/2011', async () => {
            const startDate = new Date('10/1/2010');
            const endDate = new Date('10/5/2010');
            const districts = [0];

            let err;

            try {
                await scraper.runScrapeQueue(startDate, endDate, districts, db);
            } catch (e) {
                err = e;
            }

            assert.typeOf(err, 'Error');
        });
        it('throws an error if the array of council districts passed is empty', async () => {
            const startDate = new Date('10/1/2012');
            const endDate = new Date('10/5/2012');
            const districts = [];

            let err;

            try {
                await scraper.runScrapeQueue(startDate, endDate, districts, db);
            } catch (e) {
                err = e;
            }

            assert.typeOf(err, 'Error');
        });
        describe(`Live scraping tests - set NETWORK_TEST cmd-line arg to 'TRUE' to run`, () => {
            if (process.env.NETWORK_TEST === 'TRUE') {
                afterEach(async () => {
                    await db.query('DELETE FROM calls');
                });

                describe('July 1-2, 2017, district 3', () => {
                    it('adds 581 calls to the database', async function () {
                        this.timeout(30000);
                        const startDate = new Date('7/1/2017');
                        const endDate = new Date('7/2/2017');
                        const districts = [3];

                        await scraper.runScrapeQueue(startDate, endDate, districts, db);

                        const resultsInDB = await db.many((`SELECT * FROM calls`));
                        assert.lengthOf(resultsInDB, 581);
                    });
                });

                describe('May 31 - June 2, 2011, districts 0-2', () => {
                    it('should add 2,006 calls to the database', async function () {
                        this.timeout(40000);
                        const startDate = new Date('5/31/2011');
                        const endDate = new Date('6/2/2011');
                        const districts = [0, 1, 2];

                        await scraper.runScrapeQueue(startDate, endDate, districts, db);

                        const resultsInDB = await db.many((`SELECT * FROM calls`));
                        assert.lengthOf(resultsInDB, 2006);
                    });
                });

                describe('Dec. 29, 2013 - Jan. 2, 2014, districts 9-10', () => {
                    it('should add 1,779 calls to the database', async function () {
                        this.timeout(40000);
                        const startDate = new Date('12/29/2013');
                        const endDate = new Date('1/2/2014');
                        const districts = [9, 10];

                        await scraper.runScrapeQueue(startDate, endDate, districts, db);

                        const resultsInDB = await db.many((`SELECT * FROM calls`));
                        assert.lengthOf(resultsInDB, 1779);
                    });
                });
            }
        });
    });
    describe('isCall', () => {
        it('returns true if the object passed is a valid Call', () => {
            const call: Call = {
                incidentnumber: 'foo',
                category: 'bar',
                problemtype: 'baz',
                responsedate: new Date(),
                address: 'i',
                hoa: 'am',
                schooldistrict: 'listening',
                councildistrict: 500,
                zipcode: 1
            };

            assert.isTrue(scraper.isCall(call));
        });
        it('returns false if any of the required Call properties are missing', () => {
            const call = {
                incidentnumber: 'foo',
                category: 'bar',
                problemtype: 'baz',
                address: 'i',
                hoa: 'am',
                schooldistrict: 'listening',
                councildistrict: 500,
                zipcode: 1
            };

            assert.isFalse(scraper.isCall(call));

        });
        it('returns false if any of the required Call properties are the wrong type', () => {
            const call = {
                incidentnumber: 'foo',
                category: 'bar',
                problemtype: 'baz',
                responsedate: { foo: 'bar' },
                address: 'i',
                hoa: 'am',
                schooldistrict: 'listening',
                councildistrict: 500,
                zipcode: 1
            };

            assert.isFalse(scraper.isCall(call));
        });
    });
});