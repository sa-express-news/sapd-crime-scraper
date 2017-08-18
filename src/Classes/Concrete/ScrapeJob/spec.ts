import { ScrapeJob } from './index';
import { Bag } from '../Bag';
import { Call } from '../Call';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
const assert = chai.assert;
sinon.assert.expose(assert, {prefix: ''});


describe('ScrapeJob', function(){
	this.timeout(60000);
	let job = new ScrapeJob('06/07/2017');
	describe('Methods', ()=>{
		beforeEach(()=>{
			job = new ScrapeJob('06/07/2017');
		});
		describe.skip('run', function(){
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

		describe.skip('databaseAllCalls', function(){
			it('adds every call in the bag to the db', async ()=>{

				const run = await job.run();

				const db = await job.DatabaseAllCalls();

				assert.isTrue(db);
			});
		});

		describe('getCalls', ()=>{
			it('returns a Bag', ()=>{

				assert.instanceOf(job.getCalls(), Bag);
			});
		});

		describe('GetCallsAsCSVString', ()=>{
			it.skip('returns a string', async ()=>{
				const run = await job.run();
				const csv = await job.GetCallsAsCSVString();

				assert.typeOf(csv, 'string');
			});

			it('is an empty string if the bag of calls is empty', async ()=>{
				const csv = await job.GetCallsAsCSVString();
				assert.strictEqual(csv, '');
			});
		});
	});
});