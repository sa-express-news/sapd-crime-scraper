import { Call } from '../Call';
import { Bag } from '../Bag';
import { GetRequest } from '../GetRequest';
import { PostRequest } from '../PostRequest';

import { SAPDFormParams } from '../../../Interfaces/SAPDFormParams';
import { PostRequestParams } from '../../../Interfaces/PostRequestParams';

export class ScrapeJob{
	calls: Bag<Call>;
	config: SAPDFormParams;
	page: Document;

	constructor(day: string){
		this.config = {
			ToolkitScriptManager1_HiddenField: ';;AjaxControlToolkit, Version=3.5.60623.0, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:834c499a-b613-438c-a778-d32ab4976134:f9cec9bc:de1feab2:f2c8e708:720a52bf:589eaa30:698129cf:d9d4bb33:fcf0e993:fb9b4c57:ccb96cf9',
			__EVENTTARGET: '',
			__EVENTARGUMENT: '',
			__LASTFOCUS: '',
			__VIEWSTATE: '',
			__VIEWSTATEGENERATOR: '',
			__EVENTVALIDATION: '',
			txtStart: '',
			rdbSearchRange: 'day',
			txtEndDate: '06/07/2017',
			txtZipcode: '',
			ddlCategory: 'ALL ',
			ddlCouncilDistrict: '1',
			ddlSchoolDistrict: ' ',
			cbxHOA$cbxHOA_TextBox: '',
			cbxHOA$cbxHOA_HiddenField: '-1',
			btnSearch: 'View Data'
		}

		this.calls = new Bag<Call>();
	}

	public async run(): Promise<void>{

		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		this.config.txtStart = '06/07/2017';
		// this.config.ddlSchoolDistrict = 'Alamo Heights ISD';

		const getRequest = new GetRequest();
		const firstPage = await getRequest.get('https://webapp3.sanantonio.gov/policecalls/Reports.aspx');

		this.collectAndSetSessionState(firstPage);

		const postParams: PostRequestParams = {
			method: 'POST',
			uri: 'https://webapp3.sanantonio.gov/policecalls/Reports.aspx',
			form: this.config,
			jar: getRequest.getCookieJar(),
			headers: {
				'Host': 'webapp3.sanantonio.gov',
				'Origin': 'https://webapp3.sanantonio.gov',
				'Referer': 'https://webapp3.sanantonio.gov/policecalls/Reports.aspx'
				// 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.39 Safari/537.36'
			}
		};

		const postRequest = new PostRequest(postParams);

		const posted = await postRequest.post();

		const secondPage = await getRequest.get('https://webapp3.sanantonio.gov/policecalls/Results.aspx');

		const body = secondPage.body;

		console.log(body);

	}

	private collectAndSetSessionState(page: Document): void{
		const viewStateInput = <HTMLInputElement>page.getElementById('__VIEWSTATE');
		const viewState: string = viewStateInput.value;
		this.config.__VIEWSTATE = viewState;
		console.log(viewState);

		const viewStateGeneratorInput = <HTMLInputElement>page.getElementById('__VIEWSTATEGENERATOR');
		const viewStateGenerator: string = viewStateGeneratorInput.value;
		this.config.__VIEWSTATEGENERATOR = viewStateGenerator;

		const eventValidationInput = <HTMLInputElement>page.getElementById('__EVENTVALIDATION');
		const eventValidation: string = eventValidationInput.value;
		this.config.__EVENTVALIDATION = eventValidation;
	}

	private manipulateForm
}