import { SAPDScrapeMachine } from '../Classes/Concrete/SAPDScrapeMachine';
import { CallModel } from '../index';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
// import * as fs from 'fs';
const assert = chai.assert;

if (process.env.TEST_NETWORK === 'true'){
	describe('Sample Scrapes', function(){
		afterEach(async()=>{
			await CallModel.destroy({where: {}});
		});
		describe('July 1-2, 2017, district 3', ()=>{
			it('should add 581 calls to the database', async function(){
				this.timeout(10000000000);
				try{
					const machine = new SAPDScrapeMachine({
						startDate: new Date('7/1/2017'),
						endDate: new Date('7/2/2017'),
						districts: [3]
					});

					await machine.QueueJobs();
					await machine.runJobs();

					let jobs = machine.getJobs();

					for (let job of jobs){
						await job.DatabaseAllCalls();
					}

					const calls = await CallModel.findAll();

					assert.strictEqual(calls.length, 581);

				}catch(e){
					throw new Error(e);
				}
			});
		});

		describe('March 1-7, 2011, districts 0-2', ()=>{
			it('should add 4,305 calls to the database', async function(){
				this.timeout(10000000000);
				try{
					const machine = new SAPDScrapeMachine({
						startDate: new Date('3/1/2011'),
						endDate: new Date('3/7/2011'),
						districts: [0,1,2]
					});
					await machine.QueueJobs();
					await machine.runJobs();

					let jobs = machine.getJobs();

					for (let job of jobs){
						await job.DatabaseAllCalls();
					}

					const calls = await CallModel.findAll();

					assert.strictEqual(calls.length, 4305);				
				}catch(e){
					throw new Error(e);
				}
			});
		});

		describe('May 2013, district 10', ()=>{
			it('should add 5,173 calls to the database', async function(){
				this.timeout(10000000000);
				try{
					const machine = new SAPDScrapeMachine({
						startDate: new Date('5/1/2013'),
						endDate: new Date('5/31/2013'),
						districts: [10]
					});
					await machine.QueueJobs();
					await machine.runJobs();

					let jobs = machine.getJobs();

					for (let job of jobs){
						await job.DatabaseAllCalls();
					}

					const calls = await CallModel.findAll();

					assert.strictEqual(calls.length, 5173);				
				}catch(e){
					throw new Error(e);
				}
			});
		});
	});
}

