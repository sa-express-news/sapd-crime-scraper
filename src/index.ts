import * as Sequelize from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

import { Call } from './Classes/Concrete/Call';




export const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS,{
	host: process.env.DB_HOST,
	dialect: 'postgres',
	pool: {
		max: 10,
		min: 0,
		idle: 1000
	},
	logging: false
});

export const CallModel = sequelize.define('call', {
	incidentNumber: Sequelize.STRING,
	category: Sequelize.STRING,
	problemType: Sequelize.STRING,
	responseDate: Sequelize.DATE,
	address: Sequelize.STRING,
	hoa: Sequelize.STRING,
	schoolDistrict: Sequelize.STRING,
	councilDistrict: Sequelize.INTEGER,
	zipcode: Sequelize.INTEGER
});


// get day range, other filters
// 	for each day
// 		queue a get request to the page
// 			get cookie
// 		queue a post request
// 			post a single day and other filters
// 		queue a get request to results
// 			scrape the page, creating calls along the way
// 			add each call to the bag of calls

