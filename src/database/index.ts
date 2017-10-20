import * as pgPromise from 'pg-promise';
import { IDatabase, IMain, ColumnSet } from 'pg-promise';

//Setting up database connection...

import * as dotenv from 'dotenv';
dotenv.config();

export const pgp: IMain = pgPromise();

const connectionDetails = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.PORT),
    database: process.env.DB_DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

export const db: IDatabase<any> = pgp(connectionDetails);