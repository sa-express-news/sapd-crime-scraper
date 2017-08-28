import { ScrapeMachineParams } from '../../../Interfaces/ScrapeMachineParams';
import { SAPDScrapeMachine } from '../SAPDScrapeMachine';

export class FullScrape{
	machine: SAPDScrapeMachine;

	constructor(currentDate: Date){
		this.machine = new SAPDScrapeMachine({
			startDate: new Date('01/01/2011'),
			endDate: this.calculateEndDate(currentDate),
			districts: [0,1,2,3,4,5,6,7,8,9,10]
		});
	}

	public getMachine(): SAPDScrapeMachine{
		return this.machine;
	}

	private calculateEndDate(date: Date): Date{
		return new Date(date.getFullYear(), date.getMonth(), 0);
	}
}