import { FullScrape } from './index';
import { SAPDScrapeMachine } from '../SAPDScrapeMachine';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
const assert = chai.assert;
sinon.assert.expose(assert, {prefix: ''});

describe('FullScrape', ()=>{
	let full = new FullScrape(new Date('1/17/2017'));
	beforeEach(()=>{
		full = new FullScrape(new Date('1/17/2017'));
	})
	describe('Methods', ()=>{
		describe('getMachine', ()=>{
			it('returns an SAPDScrapeMachine', ()=>{
				const machine = full.getMachine();

				assert.instanceOf(machine, SAPDScrapeMachine);

			});

		});
	});
	describe('machine', ()=>{
		it('has a start date of 1/1/11', ()=>{
			const machine = full.getMachine();

			assert.strictEqual(machine.startDate.getDate(), 1);
			assert.strictEqual(machine.startDate.getMonth(), 0);
			assert.strictEqual(machine.startDate.getFullYear(), 2011);
		});

		it('has an end date on the 28th, 29th, 30th or 31st of the month', ()=>{
			const machine = full.getMachine();

			const lastDays: number[] = [28,29,30,31];

			assert.include(lastDays, machine.endDate.getDate());
		});


		describe('testing some sample calls', ()=>{
			it('works for 1/17/17', ()=>{
				const machine = full.getMachine();
				const start: Date = machine.startDate;
				const end: Date = machine.endDate;

				assert.strictEqual(start.getFullYear(), 2011);
				assert.strictEqual(start.getMonth(), 0);
				assert.strictEqual(start.getDate(), 1);

				assert.strictEqual(end.getFullYear(), 2016);
				assert.strictEqual(end.getMonth(), 11);
				assert.strictEqual(end.getDate(), 31);

			});

			it('works for 5/1/20', ()=>{
				const full = new FullScrape(new Date('5/5/2020'));
				const machine = full.getMachine();

				const start: Date = machine.startDate;
				const end: Date = machine.endDate;

				assert.strictEqual(start.getFullYear(), 2011);
				assert.strictEqual(start.getMonth(), 0);
				assert.strictEqual(start.getDate(), 1);

				assert.strictEqual(end.getFullYear(), 2020);
				assert.strictEqual(end.getMonth(), 3);
				assert.strictEqual(end.getDate(), 30);

			});

			it('works for 9/30/11', ()=>{
				const full = new FullScrape(new Date('9/30/2011'));
				const machine = full.getMachine();

				const start: Date = machine.startDate;
				const end: Date = machine.endDate;

				assert.strictEqual(start.getFullYear(), 2011);
				assert.strictEqual(start.getMonth(), 0);
				assert.strictEqual(start.getDate(), 1);

				assert.strictEqual(end.getFullYear(), 2011);
				assert.strictEqual(end.getMonth(), 7);
				assert.strictEqual(end.getDate(), 31);
			});
		});

	});
});