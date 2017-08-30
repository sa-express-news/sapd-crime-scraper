import { sequelize } from '../index';
import { FullScrape } from '../Classes/Concrete/FullScrape';

async function main(){
	try{
		const scrapeMachine = new FullScrape(new Date()).getMachine();

		scrapeMachine.QueueJobs();
		await scrapeMachine.runJobs();
		const jobs = scrapeMachine.getJobs();

		for (let job of jobs){
			await job.DatabaseAllCalls();
		}

		sequelize.close();

		console.log(`All calls scraped and added to database ${process.env.DB}`);			
	}catch(e){
		throw new Error(e);
	}

}

main();

