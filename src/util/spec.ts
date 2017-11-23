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
    describe('getFirstOfPreviousMonth', () => {
        it('returns a Date', () => {
            const date = new Date();
            const newDate = util.getFirstOfPreviousMonth(date);

            assert.isTrue(Object.prototype.toString.call(newDate) === '[object Date]');
        });
        it(`the Date's date is 1`, () => {
            const date = new Date();
            const newDate = util.getFirstOfPreviousMonth(date);

            assert.strictEqual(newDate.getDate(), 1);
        });
        it(`the Date's month is one less than the month of the date passed to it`, () => {
            const date = new Date('11/23/2017');
            const newDate = util.getFirstOfPreviousMonth(date);

            assert.strictEqual(newDate.getMonth(), 9);
        });
        it('works across years - passing a date in January will get you Dec. 1', () => {
            const date = new Date('1/1/2017');
            const newDate = util.getFirstOfPreviousMonth(date);

            assert.strictEqual(newDate.getDate(), 1);
            assert.strictEqual(newDate.getMonth(), 11);
            assert.strictEqual(newDate.getFullYear(), 2016);
        });
    });
    describe('getLastOfPreviousMonth', () => {
        it('returns a Date', () => {
            const date = new Date();
            const newDate = util.getLastOfPreviousMonth(date);

            assert.isTrue(Object.prototype.toString.call(newDate) === '[object Date]');
        });
        it(`the Date's date is set to the last possible day of the previous month`, () => {
            const firstDate = new Date('11/12/2017');
            assert.strictEqual(util.getLastOfPreviousMonth(firstDate).getDate(), 31);

            const secondDate = new Date('5/1/2017');
            assert.strictEqual(util.getLastOfPreviousMonth(secondDate).getDate(), 30);

            const thirdDate = new Date('3/7/2017');
            assert.strictEqual(util.getLastOfPreviousMonth(thirdDate).getDate(), 28);
        });
        it(`works properly for leap years`, () => {
            const leapDate = new Date('3/5/2016');
            assert.strictEqual(util.getLastOfPreviousMonth(leapDate).getDate(), 29);
        });
        it(`the Date's month is set to one less than the month of the date passed`, () => {
            const date = new Date('10/9/2017');
            const newDate = util.getLastOfPreviousMonth(date);

            assert.strictEqual(newDate.getMonth(), 8);
        });
        it(`works properly across years`, () => {
            const date = new Date('1/1/2017');
            const newDate = util.getLastOfPreviousMonth(date);

            assert.strictEqual(newDate.getDate(), 31);
            assert.strictEqual(newDate.getMonth(), 11);
            assert.strictEqual(newDate.getFullYear(), 2016);
        })
    });
});