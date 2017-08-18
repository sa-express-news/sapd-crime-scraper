import { SAPDScrapeMachine} from './index';
import { ScrapeJob } from '../ScrapeJob';
import { Queue } from '../Queue';
import * as fs from 'fs';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
const assert = chai.assert;
sinon.assert.expose(assert, {prefix: ''});

describe('SAPDScrapeMachine', function(){
	this.timeout(60000);
	let machine = new SAPDScrapeMachine({
			startDate: new Date('06/01/2017'),
			endDate: new Date('06/02/2017'),
			districts: [0,1]
		});

	beforeEach(()=>{
		machine = new SAPDScrapeMachine({
			startDate: new Date('06/01/2017'),
			endDate: new Date('06/02/2017'),
			districts: [0,1]
		});
	});

	it('should throw an error if passed dates before 2011', ()=>{
		const badMachine = ()=>{
			return new SAPDScrapeMachine({
			startDate: new Date('06/01/2010'),
			endDate: new Date('06/02/2017'),
			districts: [0,1]
			});
		}

		assert.throws(badMachine);
	});

	describe('Methods', ()=>{
		describe('queueJobs', ()=>{
			it('fills the queue', ()=>{
				machine.QueueJobs();
				assert.isAbove(machine.getJobs().size(), 0);
			});
		});

		describe.skip('runJobs', ()=>{
			it('fills the bag of calls in each job in the queue', async()=>{
				const run = await machine.runJobs();

				const jobs = machine.getJobs();

				for (let job of jobs){
					assert.isAbove(job.getCalls().size(), 0);
				}
			});

			it('throws an error if the queue is empty', async()=>{
				const run = await machine.runJobs();

				assert.typeOf(run, 'Error');
			});
		});

		describe('getJobs', ()=>{
			it('returns a queue', ()=>{
				assert.instanceOf(machine.getJobs(), Queue);
			});
		});

		// describe('writeCallsToFile', ()=>{
		// 	it('writes the calls to a file'), async()=>{
		// 		const write = await machine.writeCallsToFile('test.csv');

		// 		fs.readFile('test.csv', 'utf8', (err, data)=>{
		// 			assert.isNull(err);
		// 			assert.isDefined(data);
		// 		});
		// 	}
		// })
	});
});