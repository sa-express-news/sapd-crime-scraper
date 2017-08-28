import { ScrapeMachineParams } from '../../../Interfaces/ScrapeMachineParams';
import { SAPDScrapeMachine } from '../SAPDScrapeMachine';

export class PreviousMonthScrape{
	machine: SAPDScrapeMachine;

	constructor(currentDate: Date){
		this.machine = new SAPDScrapeMachine({
			startDate: this.calculateStartDate(currentDate),
			endDate: this.calculateEndDate(currentDate),
			districts: [0,1,2,3,4,5,6,7,8,9,10]
		});
	}

	public getMachine(): SAPDScrapeMachine{
		return this.machine;
	}

	private calculateStartDate(date: Date): Date{
		let dateToReturn = new Date(date);
		dateToReturn.setMonth(date.getMonth() - 1, 1);
		return dateToReturn;
	}

	private calculateEndDate(date: Date): Date{
		return new Date(date.getFullYear(), date.getMonth(), 0);
	}
}