import * as dotenv from 'dotenv';
import { runScrapeQueue } from './scraper';
import { db } from './database';
import { getFirstOfPreviousMonth, getLastOfPreviousMonth } from './util';

dotenv.config();

export const main = async (): Promise<void> => {
    const districts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (process.env.FULL_SCRAPE === 'TRUE') {
        const startDate = new Date('1/1/2011');
        const endDate = getLastOfPreviousMonth(getLastOfPreviousMonth(new Date()));

        try {
            await runScrapeQueue(startDate, endDate, districts, db);
            console.log(`Scraped every call from 1/1/2011 to ${endDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`);
        } catch (e) {
            throw new Error(e);
        }

    } else {
        // Scrapes every call recorded for the previous month

        const today = new Date();
        const firstOfLastMonth = getFirstOfPreviousMonth(today);
        const lastOfLastMonth = getLastOfPreviousMonth(today);

        try {
            await runScrapeQueue(firstOfLastMonth, lastOfLastMonth, districts, db);
            console.log(`Scraped every call from ${firstOfLastMonth.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} to ${lastOfLastMonth.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}`);
        } catch (e) {
            throw new Error(e);
        }
    }
}

main();