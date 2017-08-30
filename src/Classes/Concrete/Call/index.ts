import { CallData } from '../../../Interfaces/Call';
import { CallModel } from '../../../index';

export class Call{
	private incidentNumber: string;
	private category: string;
	private problemType: string;
	private responseDate: Date;
	private address: string;
	private hoa: string;
	private schoolDistrict: string;
	private councilDistrict: number;
	private zipcode: number;

	constructor(callData: CallData){
		this.incidentNumber = callData.incidentNumber;
		this.category = callData.category;
		this.problemType = callData.problemType;
		this.responseDate = callData.responseDate;
		this.address = callData.address;
		this.hoa = callData.hoa;
		this.schoolDistrict = callData.schoolDistrict;
		this.councilDistrict = callData.councilDistrict;
		this.zipcode = callData.zipcode;
	}

	public async addToDb(): Promise<void>{
		try {
			const insert = await CallModel.upsert({
				incidentNumber: this.incidentNumber,
				category: this.category,
				problemType: this.problemType,
				responseDate: this.responseDate,
				address: this.address,
				hoa: this.hoa,
				schoolDistrict: this.schoolDistrict,
				councilDistrict: this.councilDistrict,
				zipcode: this.zipcode
			});
		
		}
		catch(e){
			throw new Error(e);
		}

		// CallModel.upsert({
		// 	incidentNumber: this.incidentNumber,
		// 	category: this.category,
		// 	problemType: this.problemType,
		// 	responseDate: this.responseDate,
		// 	address: this.address,
		// 	hoa: this.hoa,
		// 	schoolDistrict: this.schoolDistrict,
		// 	councilDistrict: this.councilDistrict,
		// 	zipcode: this.zipcode
		// }).then(()=>{
		// 	return true;
		// }).catch((e)=>{
		// 	return e;
		// });
		
	}
}