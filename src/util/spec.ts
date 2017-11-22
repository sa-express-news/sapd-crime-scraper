import * as chai from 'chai';
import 'mocha';

import * as util from './index';
import { start } from 'repl';
const assert = chai.assert;

describe('Utility code', () => {
    describe('getAllDatesBetweenInclusive', () => {
        const startDate = new Date('1/1/2017');
        const endDate = new Date('1/3/2017');
        const allDates = util.getAllDatesBetweenInclusive(startDate, endDate);
        it('returns an array', () => {
            assert.isArray(allDates);
        });
        it('each item in the array is a Date', () => {
            allDates.forEach((date) => {
                assert.isTrue(Object.prototype.toString.call(date) === '[object Date]');
            });
        });
        it('the array contains every date between the start end end ones, including the start and end', () => {
            const expectedDates = [new Date('1/1/2017'), new Date('1/2/2017'), new Date('1/3/2017')];
            allDates.forEach((date, index) => {
                const returnedDateDay = date.getDate;
                assert.strictEqual(returnedDateDay, expectedDates[index].getDate);
            });
        });
        it('if passed a start and end date on the same day, it returns just that one day', () => {
            const singleDate = util.getAllDatesBetweenInclusive(startDate, startDate);
            assert.lengthOf(singleDate, 1);
            assert.strictEqual(singleDate[0].getDate, startDate.getDate);
        });
        it('if passed an end date earlier than the start date, it returns an empty array', () => {
            const empty = util.getAllDatesBetweenInclusive(endDate, startDate);
            assert.isEmpty(empty);
        });
    });
});