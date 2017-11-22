import 'mocha';
import * as chai from 'chai';
const assert = chai.assert;

import * as dotenv from 'dotenv';
dotenv.config();

import { pgp, db, upsertReplaceQuery } from './index'

describe('Database', () => {
    describe('upsertReplaceQuery', () => {
        after(async () => {
            await db.query(`DELETE FROM empty;`);
        });
        const colSet = new pgp.helpers.ColumnSet([
            { name: 'id' },
            { name: 'foo' }
        ], { table: { table: 'empty' } });

        const data = [{ id: 1, foo: 'bar' }, { id: 2, foo: 'baz' }];
        it('returns a string', () => {

            const queryString = upsertReplaceQuery(data, colSet, 'id');

            assert.isString(queryString);
        });
        it('the string is a valid SQL query that inserts the data if not there already', async () => {
            const queryString = upsertReplaceQuery(data, colSet, 'id');

            await db.query(queryString);

            const result = await db.query('SELECT * FROM empty');

            assert.lengthOf(result, 2);
            const row1 = result[0], row2 = result[1];
            assert.strictEqual(row1.id, 1);
            assert.strictEqual(row1.foo, 'bar');
            assert.strictEqual(row2.id, 2);
            assert.strictEqual(row2.foo, 'baz');
        });
        it(`the query updates the data if there's a conflict on the constraint provided`, async () => {
            const conflictingData = [{ id: 1, foo: 'buzz' }, { id: 2, foo: 'bat' }];

            const firstQuery = upsertReplaceQuery(data, colSet, 'id');
            const secondQuery = upsertReplaceQuery(conflictingData, colSet, 'id');

            await db.query(firstQuery);
            await db.query(secondQuery);

            const result = await db.query('SELECT * FROM empty');
            const row1 = result[0], row2 = result[1];
            assert.strictEqual(row1.id, 1);
            assert.strictEqual(row1.foo, 'buzz');
            assert.strictEqual(row2.id, 2);
            assert.strictEqual(row2.foo, 'bat');
        });
    });
});
