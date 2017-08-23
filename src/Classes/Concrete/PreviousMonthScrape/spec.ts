import { PreviousMonthScrape } from './index';
import { SAPDScrapeMachine } from '../SAPDScrapeMachine';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
const assert = chai.assert;
sinon.assert.expose(assert, {prefix: ''});

describe('PreviousMonthScrape', ()=>{
	let prev = new PreviousMonthScrape(new Date('1/17/2017'));
	beforeEach(()=>{
		prev = new PreviousMonthScrape(new Date('1/17/2017'));
	})
	describe('Methods', ()=>{
		describe('getMachine', ()=>{
			it('returns an SAPDScrapeMachine', ()=>{
				const machine = prev.getMachine();

				assert.instanceOf(machine, SAPDScrapeMachine);

			});

		});
	});
	describe('machine', ()=>{
		it('has start and end dates in the same year', ()=>{
			const machine = prev.getMachine();

			assert.strictEqual(machine.startDate.getFullYear(), machine.endDate.getFullYear());
		});

		it('has a start date of the first of the month', ()=>{
			const machine = prev.getMachine();

			assert.strictEqual(machine.startDate.getDate(), 1);
		});

		it('has an end date on the 28th, 29th, 30th or 31st of the month', ()=>{
			const machine = prev.getMachine();

			const lastDays: number[] = [28,29,30,31];

			assert.include(lastDays, machine.endDate.getDate());
		});

		describe('testing some sample calls', ()=>{
			it('works for 1/17/17', ()=>{
				const machine = prev.getMachine();
				const start: Date = machine.startDate;
				const end: Date = machine.endDate;

				assert.strictEqual(start.getFullYear(), 2016);
				assert.strictEqual(start.getMonth(), 11);
				assert.strictEqual(start.getDate(), 1);

				assert.strictEqual(end.getFullYear(), 2016);
				assert.strictEqual(end.getMonth(), 11);
				assert.strictEqual(end.getDate(), 31);

			});

			it('works for 5/1/20', ()=>{
				const prev = new PreviousMonthScrape(new Date('5/5/2020'));
				const machine = prev.getMachine();

				const start: Date = machine.startDate;
				const end: Date = machine.endDate;

				assert.strictEqual(start.getFullYear(), 2020);
				assert.strictEqual(start.getMonth(), 3);
				assert.strictEqual(start.getDate(), 1);

				assert.strictEqual(end.getFullYear(), 2020);
				assert.strictEqual(end.getMonth(), 3);
				assert.strictEqual(end.getDate(), 30);

			});

			it('works for 9/30/11', ()=>{
				const prev = new PreviousMonthScrape(new Date('9/30/2011'));
				const machine = prev.getMachine();

				const start: Date = machine.startDate;
				const end: Date = machine.endDate;

				assert.strictEqual(start.getFullYear(), 2011);
				assert.strictEqual(start.getMonth(), 7);
				assert.strictEqual(start.getDate(), 1);

				assert.strictEqual(end.getFullYear(), 2011);
				assert.strictEqual(end.getMonth(), 7);
				assert.strictEqual(end.getDate(), 31);
			});
		});

	});
});