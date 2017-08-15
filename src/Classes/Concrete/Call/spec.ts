import { Call } from './index';
import { CallData } from '../../../Interfaces/Call';
import { sequelize } from '../../../index';
import * as chai from 'chai';
import 'mocha';

const assert = chai.assert;

// describe('Call', ()=>{
// 	describe('Methods', ()=>{
// 		// describe('get', ()=>{
// 		// 	// it('should return the call', ()=>{
// 		// 	// 	const dummyCall = {
// 		// 	// 		incidentNumber: '10065814',
// 		// 	// 		category: 'Property Crime Calls',
// 		// 	// 		problemType: 'Theft in Progress',
// 		// 	// 		responseDate: new Date(),
// 		// 	// 		address: '1300 Callaghan Rd',
// 		// 	// 		hoa: '',
// 		// 	// 		schoolDistrict: 'Northside ISD',
// 		// 	// 		councilDistrict: 6,
// 		// 	// 		zipcode: 78228
// 		// 	// 	};

// 		// 	// 	const call = new Call(dummyCall);

// 		// 	// 	const response = call.

// 		// 	});
// 		// });
		describe('addToDb', ()=>{
			// before(()=>{

			// })
			it('should add the call to the DB', async ()=>{
				const dummyCall = {
					incidentNumber: '1',
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


				const add = await call.addToDb(sequelize);

				assert.isTrue(add);

			});
// 		})
// 	});
});