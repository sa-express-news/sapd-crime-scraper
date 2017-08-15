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

	public async addToDb(sequelize: any): Promise<boolean>{
		try {
			 const add = await CallModel.create({
				incidentNumber: '10065814',
				category: 'Property Crime Calls',
				problemType: 'Theft in Progress',
				responseDate: new Date(),
				address: '1300 Callaghan Rd',
				hoa: '',
				schoolDistrict: 'Northside ISD',
				councilDistrict: 6,
				zipcode: 78228
			});

			return true;			
		}
		catch(e){
			return false;
		}
	}

	// public get(): Call{
	// 	const object = {incidentNumber, category, problemType, responseDate, address, hoa, schoolDistrict, councilDistrict, zipcode} = this;
	// }

}