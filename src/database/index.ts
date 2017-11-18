import * as pgPromise from 'pg-promise';
import { IDatabase, IMain, ColumnSet } from 'pg-promise';

//Setting up database connection...

import * as dotenv from 'dotenv';
dotenv.config();

// If we're in test mode, we set noLocking to true so we can override pg-promise methods in stubs
export const pgp: IMain = pgPromise({ noLocking: process.env.TEST ? true : false });

const connectionDetails = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.TEST ? process.env.TEST_DB : process.env.DB,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

export const db: IDatabase<any> = pgp(connectionDetails);

// All credit for this wonderful function goes to vitaly-t, creator of pg-promise:
// https://github.com/vitaly-t/pg-promise/issues/245
export const upsertReplaceQuery = (data: object[], columnSet: ColumnSet, constraint: string): string => {
    return pgp.helpers.insert(data, columnSet) +
        ` ON CONFLICT (${constraint}) DO UPDATE SET ` +
        columnSet.columns.map(x => {
            var col = pgp.as.name(x.name);
            return col + ' = EXCLUDED.' + col;
        }).join() + ';';
}