import { Call } from './index';
import { CallData } from '../../../Interfaces/Call';
import { CallModel } from '../../../index';
import * as chai from 'chai';
import 'mocha';
const assert = chai.assert;

describe('Call', ()=>{
	describe('Methods', ()=>{
		describe.skip('addToDb', ()=>{
			afterEach(()=>{
				CallModel.destroy({ where: {incidentNumber: 'calltest'}})
					.then(testCall =>{

					});
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

				CallModel.findOne({where: {incidentNumber: 'calltest'}})
					.then(testCall =>{
						assert.isDefined(testCall);
					});

			});

			// it('should return true if the add is successful', async ()=>{
			// 	const dummyCall = {
			// 		incidentNumber: 'calltest',
			// 		category: 'Property Crime Calls',
			// 		problemType: 'Theft in Progress',
			// 		responseDate: new Date(),
			// 		address: '1300 Callaghan Rd',
			// 		hoa: '',
			// 		schoolDistrict: 'Northside ISD',
			// 		councilDistrict: 6,
			// 		zipcode: 78228
			// 	};

			// 	const call = new Call(dummyCall);

			// 	const add = await call.addToDb();

			// 	assert.isTrue(add);
			// });
		});
	});
});
		// describe('get', ()=>{
		// 	// it('should return the call', ()=>{
		// 	// 	const dummyCall = {
		// 	// 		incidentNumber: '10065814',
		// 	// 		category: 'Property Crime Calls',
		// 	// 		problemType: 'Theft in Progress',
		// 	// 		responseDate: new Date(),
		// 	// 		address: '1300 Callaghan Rd',
		// 	// 		hoa: '',
		// 	// 		schoolDistrict: 'Northside ISD',
		// 	// 		councilDistrict: 6,
		// 	// 		zipcode: 78228
		// 	// 	};

		// 	// 	const call = new Call(dummyCall);

		// 	// 	const response = call.

		// 	});
		// });

