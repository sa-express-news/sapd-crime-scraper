import { Call } from './index';
import { CallData } from '../../../Interfaces/Call';
import { CallModel } from '../../../index';
import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
const assert = chai.assert;

describe('Call', ()=>{
	
	before(async()=>{
		await CallModel.sync();
	});

	describe('Methods', ()=>{
		describe('addToDb', ()=>{
			afterEach(async ()=>{
				await CallModel.destroy({ where: {incidentNumber: 'calltest'}});
			});

			it('should add the call to the DB', async function(){
				this.timeout(5000);
				const dummyCall = {
					incidentNumber: 'calltest',
					category: 'Property Crime Calls',
					problemType: 'Theft in Progress',
					responseDate: new Date(),
					address: '1300 Callaghan Rd',
					hoa: '',
					schoolDistrict: 'Northside ISD',
					councilDistrict: 6,
					zipcode: 78228
				};

				const call = new Call(dummyCall);

				await call.addToDb();

				const theCall = await CallModel.findOne({where: {incidentNumber: 'calltest'}});

				assert.isDefined(theCall);

				// CallModel.findOne({where: {incidentNumber: 'calltest'}})
				// 	.then(testCall =>{
				// 		assert.isDefined(testCall);
				// 	});

			});
		});
	});
});
