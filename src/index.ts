import * as dotenv from 'dotenv';

import { ScrapeJob } from './Classes/Concrete/ScrapeJob';
import { SAPDScrapeMachine } from './Classes/Concrete/SAPDScrapeMachine';
import { PreviousMonthScrape } from './Classes/Concrete/PreviousMonthScrape';

dotenv.config();

const db: string = process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB;

async function syncTable() {
	// await CallModel.sync();
	// // sequelize.close();
}

// syncTable();


// export const main : Function = async()=>{
// 	switch(process.argv[3]){
// 		case 'monthly':
// 		const machine: SAPDScrapeMachine = new PreviousMonthScrape(new Date()).getMachine();
// 		console.log('Queueing scrape jobs');
// 		await machine.QueueJobs();
// 		console.log('All jobs queued!');
// 		try{
// 			console.log('Running scrape jobs. This may take a while...');
// 			await machine.runJobs();
// 			console.log('Successfully scraped the SAPD website!');
// 			const jobs = machine.getJobs();
// 			console.log('Time to add calls to the database. This will also take a while...')
// 			for(let job of jobs){
// 				await job.DatabaseAllCalls();
// 			}
// 			console.log('Successfully added calls to the database!');
// 			sequelize.close();
// 		}catch(e){
// 			console.log(`There was an error running the scrape job: ${e}`);
// 			throw new Error(e);
// 		}
// 	}
// }

// main();



// const scrape = new ScrapeJob('06/08/2017');

// async function a(){
// 	const b = await scrape.run();
// 	const c = await scrape.GetCallsAsCSVString();
// 	// sequelize.close();
// }

// a();



// const machine = new SAPDScrapeMachine({
// 	startDate: new Date('05/01/2017'),
// 	endDate: new Date('05/01/2017'),
// 	districts: [1,2]
// });

// console.log(machine);

// async function b(){
// 	await machine.QueueJobs();
// 	await machine.runJobs();

// 	const jobs = machine.getJobs();

// 	for (let job of jobs){
// 		await job.DatabaseAllCalls();
// 	}

// 	sequelize.close();
// }

// b();


// for (let job of jobs){
// 	console.log(job.config);
// }



// import * as fs from 'fs';

// const c = async()=>{
// 	await fs.mkdir('results', '777', (err)=>{
// 		if(err){
// 			console.log('folder exists');
// 		}
// 	});
// }

// c();
