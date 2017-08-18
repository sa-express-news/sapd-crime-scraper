import { ScrapeMachineParams } from '../../../Interfaces/ScrapeMachineParams';
import { Queue } from '../Queue';
import { ScrapeJob } from '../ScrapeJob';

import * as fs from 'fs';


export class SAPDScrapeMachine implements ScrapeMachineParams{
	startDate: Date;
	endDate: Date;
	districts: number[];
	private jobs: Queue<ScrapeJob>;

	constructor(params: ScrapeMachineParams){
		const threshold: Date = new Date('01/01/2011');

		if (params.startDate < threshold || params.endDate < threshold){
			throw new Error('You must choose a date on or after Jan. 1 2011');
		}

		this.startDate = params.startDate;
		this.endDate = params.endDate;
		this.districts = params.districts;
		this.jobs = new Queue<ScrapeJob>();
	}

	public getJobs(): Queue<ScrapeJob>{
		return this.jobs;
	}

	public QueueJobs(): void{
		const targetDates: string[] = this.getAllDatesBetweenInclusive(this.startDate, this.endDate).map((date)=> {return this.convertDateToRequiredString(date)});

		targetDates.forEach(dateString=>{
			this.districts.forEach(district=>{
				this.jobs.enqueue(new ScrapeJob(dateString, district));
			});
		});
	}

	public async runJobs(): Promise<void|Error>{
		if (this.jobs.size() === 0){
			return new Error('You must queue jobs before running them');
		}

		try{
			for (let job of this.jobs){
				let run = await job.run();
			}
		}catch(e){
			return new Error(e);
		}
	}

	public async writeJobsToFile(filePath: string):Promise<void|Error>{
		let giantCSVString: string = 'incidentNumber,category,problemType,responseDate,address,hoa,schoolDistrict,councilDistrict,zipcode\n';
	
		for (let job of this.jobs){
			const string: string|Error = await job.GetCallsAsCSVString();
			if(string instanceof Error){
				throw new Error('There was an error converting calls to CSV, please try again.');
			}

			giantCSVString += string;
		}

		const write = await fs.writeFile(filePath, giantCSVString, (err)=>{
			if (err){
				return err;
			}
		});

		// if(write instanceof Error){
		// 	throw new Error('There was an error writing calls to CSV, please try again');
		// }

	}

	private getAllDatesBetweenInclusive(startDate: Date, endDate: Date): Date[]{
		let currentDate: Date = new Date(startDate.getTime());
		let datesBetween: Date[] = []; 

		while(currentDate <= endDate){
			datesBetween.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return datesBetween;
	}

	private convertDateToRequiredString(date: Date): string{
		let day: number = date.getDate();
		let dayString: string = day.toString();

		if(day < 10){
			dayString = '0' + dayString;
		}

		let month: number = date.getMonth() + 1;
		let monthString: string = month.toString();

		if (month < 10){
			monthString = '0' + monthString;
		}

		let year: string = date.getFullYear().toString();

		return `${monthString}/${dayString}/${year}`;

	}
}