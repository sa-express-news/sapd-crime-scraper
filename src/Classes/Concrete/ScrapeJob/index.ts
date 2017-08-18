import { Call } from '../Call';
import { Bag } from '../Bag';
import { GetRequest } from '../GetRequest';
import { PostRequest } from '../PostRequest';

import { CallModel } from '../../../index';

import { CallData } from '../../../Interfaces/Call';
import { SAPDFormParams } from '../../../Interfaces/SAPDFormParams';
import { PostRequestParams } from '../../../Interfaces/PostRequestParams';

const csv = require('fast-csv');
import * as fs from 'fs';

export class ScrapeJob{
	private calls: Bag<Call>;
	config: SAPDFormParams;
	private page: Document;

	constructor(day: string, councilDistrict?: number){
		this.config = {
			ToolkitScriptManager1_HiddenField: ';;AjaxControlToolkit, Version=3.5.60623.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:834c499a-b613-438c-a778-d32ab4976134:f9cec9bc:de1feab2:f2c8e708:720a52bf:589eaa30:698129cf:d9d4bb33:fcf0e993:fb9b4c57:ccb96cf9',
			__EVENTTARGET: '',
			__EVENTARGUMENT: '',
			__LASTFOCUS: '',
			__VIEWSTATE: '',
			__VIEWSTATEGENERATOR: '',
			__EVENTVALIDATION: '',
			txtStart: day,
			rdbSearchRange: 'day',
			txtEndDate: day,
			txtZipcode: '',
			ddlCategory: 'ALL ',
			ddlCouncilDistrict: '1',
			ddlSchoolDistrict: ' ',
			cbxHOA$cbxHOA_TextBox: '',
			cbxHOA$cbxHOA_HiddenField: '-1',
			btnSearch: 'View Data'
		};

		if(councilDistrict){
			this.config.ddlCouncilDistrict = councilDistrict.toString();
		}



		this.calls = new Bag<Call>();
	}

	public async run(): Promise<void|Error>{

		try{
		
			// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
			// this.config.ddlCouncilDistrict = '1';
			// this.config.ddlSchoolDistrict = 'Alamo Heights ISD';

			const getRequest: GetRequest = new GetRequest();
			const firstPage: Document = await getRequest.get('https://webapp3.sanantonio.gov/policecalls/Reports.aspx');

			this.collectAndSetSessionState(firstPage);

			const postParams: PostRequestParams = this.buildPostParams(getRequest);

			const postRequest = new PostRequest(postParams);

			const posted = await postRequest.post();

			const secondPage = await getRequest.get('https://webapp3.sanantonio.gov/policecalls/Results.aspx');

			this.scrapeCalls(secondPage);		
		}
		catch(e){
			return e;
		}
	}

	public async DatabaseAllCalls(): Promise<void|Error>{
		try{
			for (let call of this.calls){
				let a = await call.addToDb();
			}			
		}
		catch(e){
			return e;
		}
	}

	public GetCallsAsCSVString(): Promise<string|Error>{
		return new Promise((resolve, reject)=>{

			if (this.calls.size() === 0){
				return resolve('');
			}

			let arrayOfCalls = [];

			for (let call of this.calls){
				arrayOfCalls.push(call);
			}


			return csv.writeToString(arrayOfCalls, {headers:false}, function(err, data){
				if (err) return reject(err);
				return resolve(data);
			});
		});
	}

	public getCalls(): Bag<Call>{
		return this.calls;
	}

	private buildPostParams(getRequest: GetRequest): PostRequestParams{
		return {
			method: 'POST',
			uri: 'https://webapp3.sanantonio.gov/policecalls/Reports.aspx',
			form: this.config,
			jar: getRequest.getCookieJar(),
			headers: {
				'Host': 'webapp3.sanantonio.gov',
				'Origin': 'https://webapp3.sanantonio.gov',
				'Referer': 'https://webapp3.sanantonio.gov/policecalls/Reports.aspx',
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
			}
		};
	}

	private collectAndSetSessionState(page: Document): void{
		const viewStateInput = <HTMLInputElement>page.getElementById('__VIEWSTATE');
		const viewState: string = viewStateInput.value;
		this.config.__VIEWSTATE = viewState;

		const viewStateGeneratorInput = <HTMLInputElement>page.getElementById('__VIEWSTATEGENERATOR');
		const viewStateGenerator: string = viewStateGeneratorInput.value;
		this.config.__VIEWSTATEGENERATOR = viewStateGenerator;

		const eventValidationInput = <HTMLInputElement>page.getElementById('__EVENTVALIDATION');
		const eventValidation: string = eventValidationInput.value;
		this.config.__EVENTVALIDATION = eventValidation;
	}

	private scrapeCalls(page: Document): void{

		const table = page.getElementById('gvCFS');
		const rows = Array.from(table.getElementsByTagName('tr'));
		//We splice the first element because it's just the column headers
		rows.splice(0,1);

		rows.forEach((tr: HTMLTableRowElement)=>{
			const tableData: string[] = Array.from(tr.getElementsByTagName('td')).map(td=>{return td.textContent});

			const callInfo: CallData = {
				incidentNumber: tableData[0],
				category: tableData[1],
				problemType: tableData[2],
				responseDate: new Date(tableData[3]),
				address: tableData[4],
				hoa: tableData[5],
				schoolDistrict: tableData[6],
				councilDistrict: parseInt(tableData[7]),
				zipcode: tableData[8] !== '' ? parseInt(tableData[8]) : 0
			};

			this.calls.add(new Call(callInfo));
		});
	}
}