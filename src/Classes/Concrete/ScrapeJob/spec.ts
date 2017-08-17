import { ScrapeJob } from './index';
import { Bag } from '../Bag';
import { Call } from '../Call';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
const assert = chai.assert;
sinon.assert.expose(assert, {prefix: ''});


describe('ScrapeJob', ()=>{
	let job = new ScrapeJob('06/07/2017');
	describe('Methods', ()=>{
		beforeEach(()=>{
			job = new ScrapeJob('06/07/2017');
		});
		describe.skip('run', function(){
			this.timeout(15000);
			it('fills the bag of calls for a search with calls', async ()=>{
				const run = await job.run();

				const bag: Bag<Call> = job.getCalls();

				assert.isAbove(bag.size(), 0);
			});

			it('leaves the bag of calls empty on a search with no calls', async()=>{
				job = new ScrapeJob('07/04/1776');
				const run = await job.run();

				const bag: Bag<Call> = job.getCalls();

				assert.strictEqual(bag.size(), 0);
			});

		});

		describe('databaseAllCalls', ()=>{
			it('adds every call in the bag to the db', async ()=>{
				const run = await job.run();

				
			})
		})

		describe('getCalls', ()=>{
			it('returns a Bag', ()=>{

				assert.instanceOf(job.getCalls(), Bag);
			});
		});
	});
});